import { CategoryResponse } from "@/types/category";
import { api } from "../api/fetch";

/**
 * Get all categories
 * Use in Server Components with caching
 */
export const getAllCategories = async () => {
  const response = await api.get<CategoryResponse[]>("/categories", {
    next: {
      revalidate: 3600, // Cache for 1 hour (categories don't change often)
      tags: ["categories"],
    },
  });
  return response.data;
};

/**
 * Get category by ID
 */
export const getCategoryById = async (categoryId: number) => {
  const response = await api.get<CategoryResponse>(
    `/categories/${categoryId}`,
    {
      next: {
        revalidate: 3600,
        tags: [`category-${categoryId}`, "categories"],
      },
    },
  );
  return response.data;
};

/**
 * Get parent category of a specific category by its ID
 */
export const getParentCategoryByCategoryId = async (categoryId: number) => {
  const response = await api.get<CategoryResponse>(
    `/categories/${categoryId}/parent`,
    {
      next: {
        revalidate: 3600,
        tags: [`category-${categoryId}-parent`, "categories"],
      },
    },
  );
  return response.data;
};

/**
 * Get sub-categories by parent ID
 */
export const getSubCategories = async (parentId: number) => {
  const response = await api.get<CategoryResponse[]>(
    `/categories/${parentId}/sub-categories`,
    {
      next: {
        revalidate: 3600,
        tags: [`category-${parentId}-sub-categories`, "categories"],
      },
    },
  );
  return response.data;
};

/**
 * Get all parent categories
 * Perfect for navigation/header
 */
export const getParentCategories = async () => {
  const response = await api.get<CategoryResponse[]>("/categories/parents", {
    next: {
      revalidate: 3600,
      tags: ["parent-categories", "categories"],
    },
  });
  return response.data;
};
