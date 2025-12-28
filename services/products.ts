import { PaginatedResponse } from "@/types/api";
import {
  CommentResponse,
  CreateCommentRequest,
  CreateProductRequest,
  CreateProductResponse,
  DescriptionLogResponse,
  ProductDetailResponse,
  ProductListResponse,
} from "@/types/product";
import { api } from "../api/fetch";

/**
 * Get top 5 products with most bids
 * For home page "Phổ biến nhất" section
 */
export const getTopMostBidsProducts = async () => {
  const response = await api.get<ProductListResponse[]>(
    "/products/top/most-bids",
    {
      // next: {
      //   revalidate: 300, // Cache for 5 minutes (bid counts change frequently)
      //   tags: ["products", "top-most-bids"],
      // },
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Get top 5 products with highest price
 * For home page "Đấu giá cao cấp" section
 */
export const getTopHighestPriceProducts = async () => {
  const response = await api.get<ProductListResponse[]>(
    "/products/top/highest-price",
    {
      // next: {
      //   revalidate: 300, // Cache for 5 minutes
      //   tags: ["products", "top-highest-price"],
      // },
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Get top 5 products ending soon
 * For home page "Sắp kết thúc" section
 */
export const getTopEndingSoonProducts = async () => {
  const response = await api.get<ProductListResponse[]>(
    "/products/top/ending-soon",
    {
      cache: "no-store", // Don't cache - time-sensitive data
    },
  );
  return response.data;
};

/**
 * Get product detail by slug
 * For product detail page
 */
export const getProductDetailBySlug = async (slug: string) => {
  const response = await api.get<ProductDetailResponse>(
    `/products/slug/${slug}`,
    {
      auth: true,
      cache: "no-store", // Don't cache - data changes frequently with bids
    },
  );
  return response.data;
};

/**
 * Search products with filters and sorting
 * For search page
 */
export const searchProducts = async (params: {
  keyword?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sortBy?: "endTime" | "currentPrice" | "createdAt" | "bidCount";
  sortDirection?: "asc" | "desc";
}) => {
  const searchParams = new URLSearchParams();
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.categoryId)
    searchParams.set("categoryId", params.categoryId.toString());
  if (params.page !== undefined)
    searchParams.set("page", params.page.toString());
  if (params.size) searchParams.set("size", params.size.toString());
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDirection)
    searchParams.set("sortDirection", params.sortDirection);

  const response = await api.get<PaginatedResponse<ProductListResponse>>(
    `/products/search?${searchParams.toString()}`,
    {
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Get related products (same category)
 * For product detail page bottom section
 */
export const getRelatedProducts = async (id: string | number) => {
  const response = await api.get<ProductListResponse[]>(
    `/products/${id}/related`,
    {
      // next: {
      //   revalidate: 600, // Cache for 10 minutes
      //   tags: ["products", `related-${id}`],
      // },
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Get products by category ID with pagination
 * For category page
 */
export const getProductsByCategory = async (
  categoryId: number,
  params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  },
) => {
  const queryParams = new URLSearchParams({
    page: (params?.page ?? 0).toString(),
    size: (params?.size ?? 20).toString(),
    sortBy: params?.sortBy ?? "endTime",
    sortDirection: params?.sortDirection ?? "asc",
  });

  const response = await api.get<PaginatedResponse<ProductListResponse>>(
    `/products/category/${categoryId}?${queryParams}`,
    {
      cache: "no-store", // Don't cache - product listings change frequently
    },
  );
  return response.data;
};

/**
 * Get all Q&A comments for a product
 * For product detail page Q&A section
 */
export const getProductComments = async (productId: number | string) => {
  const response = await api.get<CommentResponse[]>(
    `/comments/product/${productId}`,
    {
      auth: true,
      cache: "no-store", // Don't cache - comments can change frequently
    },
  );
  return response.data;
};

/**
 * Create a new comment (question or reply)
 * For product detail page Q&A section
 */
export const createComment = async (request: CreateCommentRequest) => {
  const response = await api.post<CommentResponse>("/comments", request, {
    auth: true,
    cache: "no-store",
  });
  return response.data;
};

/**
 * Delete a comment
 * For product detail page Q&A section
 */
export const deleteComment = async (commentId: number) => {
  await api.delete(`/comments/${commentId}`, {
    auth: true,
  });
};

/**
 * Create a new product for sale
 * For seller product creation page
 * Handles multipart form data with product JSON and images
 */
export const createProduct = async (
  productData: CreateProductRequest,
  images: File[],
) => {
  const formData = new FormData();

  // Add product data as plain JSON string (not Blob)
  formData.append("productData", JSON.stringify(productData));

  // Add images
  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await api.upload<CreateProductResponse>(
    "/products/upload",
    formData,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Update product description (append only)
 * PUT /products/{id}/description
 */
export const updateProductDescription = async (
  productId: number,
  additionalDescription: string,
) => {
  await api.put(
    `/products/${productId}/description`,
    { additionalDescription },
    {
      auth: true,
      cache: "no-store",
    },
  );
};

/**
 * Get description edit history for a product
 * GET /products/{id}/description-history
 */
export const getDescriptionHistory = async (productId: number) => {
  const response = await api.get<DescriptionLogResponse[]>(
    `/products/${productId}/description-history`,
    {
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Get description edit count for a product
 * GET /products/{id}/description-history/count
 */
export const getDescriptionHistoryCount = async (productId: number) => {
  const response = await api.get<number>(
    `/products/${productId}/description-history/count`,
    {
      cache: "no-store",
    },
  );
  return response.data;
};
