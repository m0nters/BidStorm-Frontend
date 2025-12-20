import { getAllCategories } from "@/services/categories";
import { searchProducts } from "@/services/products";
import SearchPageClient from "./SearchPageClient";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
    sortBy?: string;
    sortDirection?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const keyword = params.q || "";
  const categoryId = params.category ? parseInt(params.category) : undefined;
  const page = params.page ? parseInt(params.page) - 1 : 0;
  const sortBy =
    (params.sortBy as "endTime" | "currentPrice" | "createdAt" | "bidCount") ||
    "endTime";
  const sortDirection = (params.sortDirection as "asc" | "desc") || "asc";

  // Fetch initial data
  const [products, categories] = await Promise.all([
    searchProducts({
      keyword: keyword || undefined,
      categoryId,
      page,
      size: 20,
      sortBy,
      sortDirection,
    }),
    getAllCategories(),
  ]);

  return (
    <SearchPageClient
      initialProducts={products}
      initialKeyword={keyword}
      categories={categories}
    />
  );
}
