"use client";

import { useScrollLock } from "@/hooks";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;
  useScrollLock(isOpen);

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
        <p className="mb-6 text-gray-700">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="flex-1 cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="flex-1 cursor-pointer rounded-lg bg-black px-4 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
