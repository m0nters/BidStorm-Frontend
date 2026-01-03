"use client";

import { useState } from "react";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";

interface AddCategoryCardProps {
  isChild?: boolean;
  parentId?: number | null;
  onSave: (name: string, parentId: number | null) => Promise<void>;
  onCancel: () => void;
  isExpanded?: boolean;
  className?: string;
}

export const AddCategoryCard = ({
  isChild = false,
  parentId = null,
  onSave,
  onCancel,
  isExpanded = false,
  className = "",
}: AddCategoryCardProps) => {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSave(name, parentId);
      setName("");
    } catch (error) {
      // Error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => {}}
        className={`group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 transition-all hover:border-gray-400 hover:bg-gray-50 ${isChild ? "ml-8" : ""}`}
      >
        <FiPlus className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
        <span className="text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-700">
          {isChild ? "Thêm danh mục con" : "Thêm danh mục cha"}
        </span>
      </button>
    );
  }

  return (
    <div className={`relative ${isChild ? "ml-8" : ""} ${className}`}>
      <div className="absolute -top-3 left-0 z-0 -ml-8 flex h-full">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute -top-11 left-4 h-[93px] w-px bg-gray-300" />
          {/* Horizontal line */}
          <div className="absolute top-12 left-4 h-px w-4 bg-gray-300" />
        </div>
      </div>
      <div
        className={`relative space-y-3 rounded-lg border-2 border-blue-500 bg-white p-4 shadow-md`}
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Tên danh mục {isChild ? "con" : "cha"}{" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
            placeholder={`Nhập tên danh mục ${isChild ? "con" : "cha"}`}
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={submitting || !name.trim()}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-black px-4 py-1.5 text-sm text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiCheck className="h-4 w-4" />
            {submitting ? "Đang tạo..." : "Tạo"}
          </button>
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX className="h-4 w-4" />
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};
