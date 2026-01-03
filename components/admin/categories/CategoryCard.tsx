"use client";

import { DropdownMenu } from "@/components/ui/common";
import { updateCategory } from "@/services/admin";
import { CategoryResponse } from "@/types";
import { useState } from "react";
import { FiCheck, FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

interface CategoryCardProps {
  category: CategoryResponse;
  isChild?: boolean;
  isLastChild?: boolean; // for adjusting the UI
  parentCategories: CategoryResponse[];
  onClick?: () => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
  onAddChild?: () => void;
  className?: string;
}

export const CategoryCard = ({
  category,
  isChild = false,
  isLastChild = false,
  parentCategories,
  onClick,
  onEdit,
  onDelete,
  onAddChild,
  className = "",
}: CategoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    parentId: category.parentId,
  });

  const handleStartEdit = () => {
    setIsEditing(true);
    setFormData({
      name: category.name,
      parentId: category.parentId,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: category.name,
      parentId: category.parentId,
    });
  };

  const handleSaveEdit = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      setSubmitting(true);
      await updateCategory(category.id, formData);
      toast.success("Cập nhật danh mục thành công");
      setIsEditing(false);
      onEdit(); // Refresh the list
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật danh mục");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`relative ${isChild ? "ml-8" : ""} ${className}`}>
        {isChild && (
          <div className="absolute -top-2 left-0 -ml-8 flex h-full">
            <div className="relative">
              {/* Vertical line */}
              <div
                className={`absolute -top-11 left-4 w-px bg-gray-300 ${isLastChild ? "h-[140px]" : "h-56"}`}
              />
              {/* Horizontal line */}
              <div className="absolute top-24 left-4 h-px w-4 bg-gray-300" />
            </div>
          </div>
        )}
        <div className="relative z-20 rounded-lg border border-blue-500 bg-white p-4 shadow-md">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Tên danh mục <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Nhập tên danh mục"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Danh mục cha
              </label>
              <DropdownMenu
                value={formData.parentId?.toString() || ""}
                options={[
                  { value: "", label: "Không (Danh mục cha)" },
                  ...parentCategories
                    .filter((cat) => cat.id !== category.id)
                    .map((cat) => ({
                      value: cat.id.toString(),
                      label: cat.name,
                    })),
                ]}
                isSorted={false}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    parentId: value ? Number(value) : null,
                  })
                }
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={submitting}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-black px-4 py-1.5 text-sm text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiCheck className="h-4 w-4" />
                {submitting ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={submitting}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX className="h-4 w-4" />
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isChild ? "ml-8" : ""} ${className}`}>
      {isChild && (
        <div className="absolute -top-2 left-0 z-0 -ml-8 flex h-full">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute -top-11 left-4 h-[93px] w-px bg-gray-300" />
            {/* Horizontal line */}
            <div className="absolute top-12 left-4 h-px w-4 bg-gray-300" />
          </div>
        </div>
      )}
      <div
        className="relative z-10 rounded-lg border bg-white p-4 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:bg-gray-100"
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              {category.isParent && (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  Danh mục cha
                </span>
              )}
            </div>
            <div className="mt-1 flex gap-4 text-sm text-gray-500">
              <span>ID: {category.id}</span>
              {category.childrenCount > 0 && (
                <span>{category.childrenCount} danh mục con</span>
              )}
            </div>
          </div>
          <div
            className="flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {!isChild && onAddChild && (
              <button
                onClick={onAddChild}
                className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-green-50"
                title="Thêm danh mục con"
              >
                <FiPlus className="text-green-600" />
              </button>
            )}
            <button
              onClick={handleStartEdit}
              className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-50"
              title="Chỉnh sửa"
            >
              <FiEdit2 className="text-blue-600" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-red-50"
              title="Xóa"
            >
              <FiTrash2 className="text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
