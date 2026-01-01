"use client";

import { WS_BASE_URL, getAccessToken } from "@/api/config";
import { getProductComments } from "@/services";
import { CommentResponse } from "@/types";
import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";

interface CommentEvent {
  type: "NEW_COMMENT" | "DELETE_COMMENT";
  productId: number;
  comment?: CommentResponse;
  commentId?: number;
}

interface UseProductCommentsOptions {
  isSeller?: boolean;
}

export const useProductComments = (
  productId: number,
  options: UseProductCommentsOptions = {},
) => {
  const { isSeller = false } = options;
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const stompClientRef = useRef<Client | null>(null);
  const isConnectedRef = useRef(false);
  const ignoredCommentIdsRef = useRef<Set<number>>(new Set());

  const removeCommentById = useCallback(
    (commentList: CommentResponse[], id: number): CommentResponse[] => {
      return commentList
        .filter((c) => c.id !== id)
        .map((c) => ({
          ...c,
          replies: removeCommentById(c.replies || [], id),
        }));
    },
    [],
  );

  const addComment = useCallback(
    (
      commentList: CommentResponse[],
      newComment: CommentResponse,
    ): CommentResponse[] => {
      if (!newComment.parentId) {
        return [newComment, ...commentList];
      }

      return commentList.map((c) => {
        if (c.id === newComment.parentId) {
          return {
            ...c,
            replies: [newComment, ...(c.replies || [])],
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: addComment(c.replies, newComment),
          };
        }
        return c;
      });
    },
    [],
  );

  const handleCommentEvent = useCallback(
    (event: CommentEvent) => {
      switch (event.type) {
        case "NEW_COMMENT":
          if (event.comment) {
            // Skip if this comment was added via API (user's own comment)
            if (ignoredCommentIdsRef.current.has(event.comment.id)) {
              return;
            }

            // Check if comment already exists in state (prevent duplicates)
            setComments((prev) => {
              const commentExists = (list: CommentResponse[]): boolean => {
                return list.some(
                  (c) =>
                    c.id === event.comment!.id ||
                    (c.replies && commentExists(c.replies)),
                );
              };

              if (commentExists(prev)) {
                return prev; // Comment already exists, don't add
              }

              return addComment(prev, event.comment!);
            });
          }
          break;

        case "DELETE_COMMENT":
          if (event.commentId) {
            setComments((prev) => removeCommentById(prev, event.commentId!));
          }
          break;
      }
    },
    [addComment, removeCommentById],
  );

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await getProductComments(productId);
        setComments(data);
      } catch (error) {
        toast.error("Không thể tải câu hỏi");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [productId]);

  useEffect(() => {
    if (isConnectedRef.current && stompClientRef.current?.active) {
      return;
    }

    let socket: any = null;
    let stompClient: Client | null = null;

    const connect = () => {
      socket = new SockJS(WS_BASE_URL);

      const token = getAccessToken();
      const connectHeaders: any = {};

      // Add JWT token to connection headers if available (required for seller channel)
      if (token) {
        connectHeaders.Authorization = `Bearer ${token}`;
      }

      stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders, // Send JWT in CONNECT frame
        onConnect: () => {
          isConnectedRef.current = true;

          // Subscribe to appropriate channel based on user role
          const channel = isSeller
            ? `/topic/product/${productId}/comments/seller` // Seller sees unmasked names
            : `/topic/product/${productId}/comments`; // Others see masked names

          stompClient!.subscribe(channel, (message) => {
            try {
              const event: CommentEvent = JSON.parse(message.body);
              handleCommentEvent(event);
            } catch (error) {
              console.error("Error parsing WebSocket message:", error);
            }
          });
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
          isConnectedRef.current = false;

          // Handle authentication errors
          if (frame.headers.message?.includes("Authentication required")) {
            console.error("WebSocket authentication failed");
          }
        },
        onWebSocketError: () => {
          isConnectedRef.current = false;
        },
        onDisconnect: () => {
          isConnectedRef.current = false;
        },
        onWebSocketClose: () => {
          isConnectedRef.current = false;
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
      isConnectedRef.current = false;
    };
  }, [productId, isSeller, handleCommentEvent]);

  const addCommentOptimistically = useCallback(
    (comment: CommentResponse) => {
      // Mark this comment ID to be ignored when WebSocket broadcast arrives
      ignoredCommentIdsRef.current.add(comment.id);

      // Add or replace comment in local state
      setComments((prev) => {
        const commentExists = (list: CommentResponse[]): boolean => {
          return list.some(
            (c) =>
              c.id === comment.id || (c.replies && commentExists(c.replies)),
          );
        };

        if (commentExists(prev)) {
          // Replace the masked version with unmasked version
          const replaceComment = (
            list: CommentResponse[],
          ): CommentResponse[] => {
            return list.map((c) => {
              if (c.id === comment.id) {
                return comment; // Replace with personalized version
              }
              if (c.replies && c.replies.length > 0) {
                return { ...c, replies: replaceComment(c.replies) };
              }
              return c;
            });
          };
          return replaceComment(prev);
        }

        return addComment(prev, comment);
      });
    },
    [addComment],
  );

  return {
    comments,
    loading,
    setComments,
    addCommentOptimistically,
  };
};
