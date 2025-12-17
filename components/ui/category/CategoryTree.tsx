"use client";

import { CategoryResponse } from "@/types/category";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

interface CategoryTreeProps {
  categories: CategoryResponse[];
  currentCategoryId: number;
}

export function CategoryTree({
  categories,
  currentCategoryId,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );

  // Auto-expand parent categories of the current category
  useEffect(() => {
    const expanded = new Set<number>();

    const findAndExpandParents = (categories: CategoryResponse[]): boolean => {
      for (const category of categories) {
        if (category.id === currentCategoryId) {
          if (category.children?.length) expanded.add(category.id);
          return true;
        }
        if (category.children?.length) {
          if (findAndExpandParents(category.children)) {
            expanded.add(category.id);
            return true;
          }
        }
      }
      return false;
    };

    findAndExpandParents(categories);
    setExpandedCategories(expanded);
  }, [categories, currentCategoryId]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const renderCategory = (category: CategoryResponse, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isActive = category.id === currentCategoryId;
    const hasChildren = category.children && category.children.length > 0;
    const isParent = level === 0;

    return (
      <div key={category.id} className="select-none">
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
            isParent ? "text-base" : "text-sm"
          } ${
            isActive
              ? "bg-black font-semibold text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleCategory(category.id);
              }}
              className={`shrink-0 p-0.5 transition-transform duration-200 ${
                isActive ? "text-white" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {isExpanded ? (
                <FiChevronRight
                  className="h-4 w-4 rotate-90 transform"
                  aria-label="Collapse category"
                />
              ) : (
                <FiChevronRight
                  className="h-4 w-4"
                  aria-label="Expand category"
                />
              )}
            </button>
          ) : (
            <div className="w-5" /> // Spacer for alignment
          )}

          {/* Category Link */}
          <Link href={`/danh-muc/${category.slug}`} className="flex-1 truncate">
            {category.name}
          </Link>

          {/* Children Count Badge */}
          {hasChildren && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              title={`${category.children!.length} danh mục con`}
            >
              {category.children!.length}
            </span>
          )}
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.children!.map((child) =>
              renderCategory(child, level + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1 rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Danh mục</h3>
      <div className="space-y-1">
        {categories.map((category) => renderCategory(category))}
      </div>
    </div>
  );
}
