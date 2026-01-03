"use client";

import { CategoryResponse } from "@/types/category";

interface CategoryFilterProps {
  categories: CategoryResponse[];
  categoryId?: string | null;
  onCategoryChange: (id: string) => void;
}

export default function CategoryFilter({
  categories,
  categoryId,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-medium text-gray-900">Danh mục</h3>
      <div className="space-y-2">
        <label className="flex cursor-pointer items-center">
          <input
            type="radio"
            name="category"
            checked={!categoryId}
            onChange={() => onCategoryChange("")}
            className="h-4 w-4 accent-black"
          />
          <span className="ml-2 text-sm text-gray-700">Tất cả danh mục</span>
        </label>

        {categories.map((category) => (
          <div key={category.id}>
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="category"
                checked={categoryId === category.id.toString()}
                onChange={() => onCategoryChange(category.id.toString())}
                className="h-4 w-4 accent-black"
              />
              <span className="ml-2 text-sm text-gray-700">
                {category.name}
              </span>
            </label>

            {/* Subcategories */}
            {category.children && category.children.length > 0 && (
              <div className="mt-2 ml-6 space-y-2">
                {category.children.map((child) => (
                  <label
                    key={child.id}
                    className="flex cursor-pointer items-center"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={categoryId === child.id.toString()}
                      onChange={() => onCategoryChange(child.id.toString())}
                      className="h-4 w-4 accent-black"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {child.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
