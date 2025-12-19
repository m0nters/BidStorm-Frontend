"use client";

import { WS_BASE_URL } from "@/api/config";
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

export const useProductComments = (productId: number) => {
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
            // Ignore if this comment was already added via API (don't delete from set)
            if (ignoredCommentIdsRef.current.has(event.comment.id)) {
              return;
            }

            // Also check if comment already exists in state (prevent duplicates)
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
    let mounted = true;

    const connect = () => {
      socket = new SockJS(WS_BASE_URL);

      stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          if (!mounted) return;

          isConnectedRef.current = true;

          stompClient!.subscribe(
            `/topic/product/${productId}/comments`,
            (message) => {
              try {
                const event: CommentEvent = JSON.parse(message.body);
                handleCommentEvent(event);
              } catch (error) {
                console.error("Error parsing WebSocket message:", error);
              }
            },
          );
        },
        onStompError: () => {
          isConnectedRef.current = false;
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
      mounted = false;
      clearTimeout(timeoutId);
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
      isConnectedRef.current = false;
    };
  }, [productId, handleCommentEvent]);

  const addCommentOptimistically = useCallback(
    (comment: CommentResponse) => {
      // Mark this comment ID to be ignored when it arrives via WebSocket
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
