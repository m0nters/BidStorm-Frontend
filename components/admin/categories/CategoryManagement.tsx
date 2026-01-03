"use client";

import { ConfirmDialog } from "@/components/ui/common";
import { createCategory, deleteCategory } from "@/services/admin";
import { getAllCategories } from "@/services/categories";
import { CategoryResponse } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { AddCategoryCard } from "./AddCategoryCard";
import { CategoryCard } from "./CategoryCard";

export const CategoryManagement = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateParent, setShowCreateParent] = useState(false);
  const [addingChildToParent, setAddingChildToParent] = useState<number | null>(
    null,
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
      // Initialize all parent categories as expanded
      const parentIds = data
        .filter((cat) => cat.isParent || cat.parentId === null)
        .map((cat) => cat.id);
      setExpandedCategories(new Set(parentIds));
      router.refresh(); // Refresh header categories
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (
    name: string,
    parentId: number | null,
  ) => {
    try {
      await createCategory({ name, parentId });
      toast.success("Tạo danh mục thành công");
      setShowCreateParent(false);
      setAddingChildToParent(null);
      await fetchCategories();
    } catch (error: any) {
      toast.error(error?.message || "Không thể tạo danh mục");
      throw error;
    }
  };

  const handleDeleteClick = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setShowDeleteConfirm(false);
    try {
      await deleteCategory(categoryToDelete);
      toast.success("Xóa danh mục thành công");
      await fetchCategories();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa danh mục");
    } finally {
      setCategoryToDelete(null);
    }
  };

  const getParentCategories = () => {
    return categories.filter((cat) => cat.isParent || cat.parentId === null);
  };

  const toggleExpand = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {/* Add Parent Category Card */}
        {showCreateParent ? (
          <AddCategoryCard
            isExpanded
            isAlone={true}
            parentId={null}
            onSave={handleCreateCategory}
            onCancel={() => setShowCreateParent(false)}
          />
        ) : (
          <div
            onClick={() => setShowCreateParent(true)}
            className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            <FiPlus className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
            <span className="text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-700">
              Thêm danh mục cha
            </span>
          </div>
        )}

        {categories.length === 0 ? (
          <div className="rounded-lg bg-white py-12 text-center">
            <p className="text-gray-500">Chưa có danh mục nào</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="flex items-start gap-4">
              {category.childrenCount > 0 && (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="mt-4 cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100"
                  title={
                    expandedCategories.has(category.id) ? "Thu gọn" : "Mở rộng"
                  }
                >
                  <FiChevronDown
                    className={`h-5 w-5 transition-transform ${
                      expandedCategories.has(category.id)
                        ? "rotate-0"
                        : "-rotate-90"
                    }`}
                  />
                </button>
              )}
              <div className="flex-1">
                <CategoryCard
                  category={category}
                  parentCategories={getParentCategories()}
                  onClick={() => toggleExpand(category.id)}
                  onEdit={fetchCategories}
                  onDelete={handleDeleteClick}
                  onAddChild={
                    category.isParent
                      ? () => setAddingChildToParent(category.id)
                      : undefined
                  }
                />
                {expandedCategories.has(category.id) &&
                  category.children &&
                  category.children.length > 0 &&
                  category.children.map((child, index) => (
                    <CategoryCard
                      key={child.id}
                      category={child}
                      isChild
                      isLastChild={index === category.children!.length - 1}
                      parentCategories={getParentCategories()}
                      onEdit={fetchCategories}
                      onDelete={handleDeleteClick}
                      className="mt-2"
                    />
                  ))}
                {/* Add Child Category Card */}
                {addingChildToParent === category.id && (
                  <AddCategoryCard
                    isChild
                    isExpanded
                    parentId={category.id}
                    onSave={handleCreateCategory}
                    onCancel={() => setAddingChildToParent(null)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
        confirmText="Xóa danh mục"
        cancelText="Hủy"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
};
