"use client";

import { RichTextEditor } from "@/components/ui/form";
import { useScrollLock } from "@/hooks";
import { useState } from "react";
import { FiX } from "react-icons/fi";

interface UpdateDescriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
}

export const UpdateDescriptionDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: UpdateDescriptionDialogProps) => {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useScrollLock(isOpen);
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strip HTML tags to check actual content length
    const textContent = description.replace(/<[^>]*>/g, "").trim();

    if (textContent.length < 10) {
      setError("Mô tả bổ sung phải có ít nhất 10 ký tự");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await onSubmit(description);
      setDescription("");
      onClose();
    } catch (error: any) {
      setError(error?.message || "Không thể cập nhật mô tả");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setDescription("");
      setError("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Bổ sung mô tả sản phẩm
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="flex cursor-pointer items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
            disabled={submitting}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Nội dung mới sẽ được{" "}
            <strong>bổ sung</strong> vào phần mô tả hiện tại, không thể thay thế
            mô tả cũ. Lịch sử cập nhật sẽ được lưu lại và hiển thị công khai.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nội dung bổ sung <span className="text-red-600">*</span>
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Nhập nội dung bổ sung (tối thiểu 10 ký tự)"
              error={error}
              disabled={submitting}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="flex-1 cursor-pointer rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="flex-1 cursor-pointer rounded-lg bg-black py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? "Đang cập nhật..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
