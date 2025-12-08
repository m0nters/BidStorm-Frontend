import { ProductDetailResponse, ProductListResponse } from "@/types/product";
import { fetchApi } from "../fetch";

/**
 * Get top 5 products with most bids
 * For home page "Phổ biến nhất" section
 */
export const getTopMostBidsProducts = async () => {
  const response = await fetchApi.get<ProductListResponse[]>(
    "/products/top/most-bids",
    {
      next: {
        revalidate: 300, // Cache for 5 minutes (bid counts change frequently)
        tags: ["products", "top-most-bids"],
      },
    },
  );
  return response.data;
};

/**
 * Get top 5 products with highest price
 * For home page "Đấu giá cao cấp" section
 */
export const getTopHighestPriceProducts = async () => {
  const response = await fetchApi.get<ProductListResponse[]>(
    "/products/top/highest-price",
    {
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ["products", "top-highest-price"],
      },
    },
  );
  return response.data;
};

/**
 * Get top 5 products ending soon
 * For home page "Sắp kết thúc" section
 */
export const getTopEndingSoonProducts = async () => {
  const response = await fetchApi.get<ProductListResponse[]>(
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
  const response = await fetchApi.get<ProductDetailResponse>(
    `/products/slug/${slug}`,
    {
      cache: "no-store", // Don't cache - data changes frequently with bids
    },
  );
  return response.data;
};

/**
 * Get related products (same category)
 * For product detail page bottom section
 */
export const getRelatedProducts = async (id: string | number) => {
  const response = await fetchApi.get<ProductListResponse[]>(
    `/products/${id}/related`,
    {
      next: {
        revalidate: 600, // Cache for 10 minutes
        tags: ["products", `related-${id}`],
      },
    },
  );
  return response.data;
};
