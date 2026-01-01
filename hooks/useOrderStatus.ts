import { WS_BASE_URL } from "@/api/config";
import { OrderStatus, OrderStatusEvent } from "@/types/order";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

interface UseOrderStatusOptions {
  orderId: number;
  accessToken: string | null;
  enabled?: boolean;
  onStatusChange?: (event: OrderStatusEvent) => void;
}

export const useOrderStatus = ({
  orderId,
  accessToken,
  enabled = true,
  onStatusChange,
}: UseOrderStatusOptions) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stompClientRef = useRef<Client | null>(null);
  const onStatusChangeRef = useRef(onStatusChange);

  // Update ref when callback changes (without reconnecting)
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    if (!enabled || !accessToken || !orderId) {
      return;
    }

    let socket: any = null;
    let stompClient: Client | null = null;

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
          console.log("Order status WebSocket connected");
          setConnected(true);

          // Subscribe to order status updates
          stompClient!.subscribe(
            `/topic/order/${orderId}/status`,
            (message) => {
              try {
                const statusEvent: OrderStatusEvent = JSON.parse(message.body);

                // Update local state
                setCurrentStatus(statusEvent.status);
                setStatusMessage(statusEvent.message);

                // Call external handler if provided (use ref to get latest)
                if (onStatusChangeRef.current) {
                  onStatusChangeRef.current(statusEvent);
                }
              } catch (error) {
                console.error("Error parsing status event:", error);
              }
            },
          );
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
          setError("Lỗi kết nối WebSocket");
          setConnected(false);
        },
        onDisconnect: () => {
          console.log("Order status WebSocket disconnected");
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
  }, [orderId, accessToken, enabled]);

  return {
    currentStatus,
    statusMessage,
    connected,
    error,
  };
};
