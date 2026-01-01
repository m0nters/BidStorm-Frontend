import { WS_BASE_URL } from "@/api/config";
import { getChatHistory } from "@/services/orders";
import { ChatEvent, ChatMessageResponse } from "@/types/order";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

interface UseOrderChatOptions {
  productId: number;
  accessToken: string | null;
  enabled?: boolean;
}

export const useOrderChat = ({
  productId,
  accessToken,
  enabled = true,
}: UseOrderChatOptions) => {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!enabled || !accessToken || !productId || productId <= 0) {
      setLoading(false);
      return;
    }

    let socket: any = null;
    let stompClient: Client | null = null;

    // Load chat history
    const loadHistory = async () => {
      try {
        setLoading(true);
        const history = await getChatHistory(productId);
        setMessages(history);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load chat history:", err);
        // If 404, chat endpoint might not exist yet - show warning but allow chat
        if (err?.message?.includes("404") || err?.status === 404) {
          console.warn(
            "Chat history endpoint not found - chat may not be implemented yet",
          );
          setMessages([]); // Empty history, but allow sending
          setError(null); // Don't show error to user
        } else {
          setError("Không thể tải lịch sử chat");
        }
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    const connect = () => {
      // Setup WebSocket connection
      socket = new SockJS(WS_BASE_URL);

      stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setConnected(true);

          // Subscribe to chat messages
          stompClient!.subscribe(
            `/topic/order/${productId}/chat`,
            (message) => {
              try {
                const chatEvent: ChatEvent = JSON.parse(message.body);

                // when new message arrives, update real time on frontend
                // doesn't need to get history
                setMessages((prev) => [
                  ...prev,
                  {
                    id: chatEvent.id,
                    senderId: chatEvent.senderId,
                    senderName: chatEvent.senderName,
                    message: chatEvent.message,
                    createdAt: chatEvent.createdAt,
                    isOwnMessage: false, // this will be fixed on frontend based on sender id
                  },
                ]);
              } catch (error) {
                console.error("Error parsing chat event:", error);
              }
            },
          );
        },
        onStompError: (frame) => {
          console.error(
            "STOMP error:",
            frame.headers?.message || frame.command,
          );
        },
        onDisconnect: () => {
          setConnected(false);
        },
        onWebSocketClose: () => {
          setConnected(false);
        },
        onWebSocketError: () => {
          setConnected(false);
        },
      });

      stompClient.activate();
      stompClientRef.current = stompClient;
    };

    const timeoutId = setTimeout(connect, 100);

    return () => {
      clearTimeout(timeoutId);
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
      stompClientRef.current = null;
    };
  }, [productId, accessToken, enabled]);

  /**
   * Send a chat message
   */
  const sendMessage = (messageText: string) => {
    if (!stompClientRef.current || !connected) {
      console.error("WebSocket not connected", {
        hasClient: !!stompClientRef.current,
        connected,
      });
      return;
    }

    if (!messageText.trim()) {
      console.warn("Empty message, not sending");
      return;
    }

    const payload = { message: messageText };

    try {
      stompClientRef.current.publish({
        destination: `/app/order/${productId}/chat`,
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to publish message:", error);
    }
  };

  return {
    messages,
    loading,
    error,
    connected,
    sendMessage,
  };
};
