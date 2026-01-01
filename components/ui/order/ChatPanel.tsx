"use client";

import { ChatMessageResponse } from "@/types/order";
import { formatDateForFeed, formatFullDateTime } from "@/utils/dateTime";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

interface ChatPanelProps {
  messages: ChatMessageResponse[];
  onSendMessage: (message: string) => void;
  loading: boolean;
  connected: boolean;
  currentUserId?: number;
  isBuyer?: boolean;
}

export const ChatPanel = ({
  messages,
  onSendMessage,
  loading,
  connected,
  currentUserId,
  isBuyer = false,
}: ChatPanelProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  // and focus input
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && connected) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
          <p className="text-sm text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">
          {isBuyer ? "Chat với người bán" : "Chat với người mua"}
        </h2>
        <div className="mt-1 flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-xs text-gray-600">
            {connected ? "Đã kết nối" : "Mất kết nối"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isOwnMessage =
                msg.isOwnMessage || msg.senderId === currentUserId;

              return (
                <div
                  ref={messagesEndRef} // since there's 1 ref, this will be set on the last message
                  key={msg.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? "bg-black text-white"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {!isOwnMessage && (
                      <p className="mb-1 text-xs font-semibold">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="wrap-break-word whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <p
                      className={`mt-1 text-xs ${isOwnMessage ? "text-gray-300" : "text-gray-500"}`}
                      title={formatFullDateTime(msg.createdAt)}
                    >
                      {formatDateForFeed(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={connected ? "Nhập tin nhắn..." : "Đang kết nối..."}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="cursor-pointer rounded-lg bg-black px-4 py-2 text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            title={
              !connected
                ? "WebSocket chưa kết nối - tin nhắn sẽ được gửi khi kết nối"
                : ""
            }
          >
            <FiSend size={20} />
          </button>
        </form>
        {!connected && (
          <p className="mt-2 text-xs text-yellow-600">
            Thử làm mới trang để kết nối lại...
          </p>
        )}
      </div>
    </div>
  );
};
