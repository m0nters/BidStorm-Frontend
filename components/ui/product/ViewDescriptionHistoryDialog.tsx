"use client";

import { DescriptionLogResponse } from "@/types/product";
import { decodeHTMLEntities } from "@/utils";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

interface ViewDescriptionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  fetchHistory: (productId: number) => Promise<DescriptionLogResponse[]>;
}

export const ViewDescriptionHistoryDialog = ({
  isOpen,
  onClose,
  productId,
  fetchHistory,
}: ViewDescriptionHistoryDialogProps) => {
  const [history, setHistory] = useState<DescriptionLogResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      const loadHistory = async () => {
        setLoading(true);
        try {
          const data = await fetchHistory(productId);
          setHistory(data);
        } catch (error) {
          console.error("Error loading description history:", error);
        } finally {
          setLoading(false);
        }
      };
      loadHistory();
    }
  }, [isOpen, productId, fetchHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            Lịch sử chỉnh sửa mô tả
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto px-6 py-4"
          style={{ maxHeight: "calc(90vh - 80px)" }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              Chưa có lịch sử chỉnh sửa
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((log, index) => (
                <div key={log.id} className="rounded-lg border border-gray-200">
                  {/* Timestamp */}
                  <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
                    <span className="p-4 font-medium">
                      {index === 0
                        ? `Lần ${history.length - index} (Mới nhất)`
                        : `Lần ${history.length - index}`}
                    </span>
                    <span className="p-4">
                      {new Date(log.updatedAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className="prose prose-slate prose-sm max-w-none rounded p-4 wrap-break-word"
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{
                      __html: decodeHTMLEntities(log.updatedContent),
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
