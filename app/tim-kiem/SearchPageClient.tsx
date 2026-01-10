"use client";

import CategoryFilter from "@/components/ui/category/CategoryFilter";
import { DropdownMenu, Pagination } from "@/components/ui/common/";
import { EmptyState, ProductCard } from "@/components/ui/product/";
import { searchProducts } from "@/services/products";
import { PaginatedResponse } from "@/types/api";
import { CategoryResponse } from "@/types/category";
import { ProductListResponse } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";

interface SearchPageClientProps {
  initialProducts: PaginatedResponse<ProductListResponse>;
  initialKeyword: string;
  categories: CategoryResponse[];
}

type SortOption = "endTime" | "currentPrice" | "createdAt" | "bidCount";
type SortDirection = "asc" | "desc";
type StatusFilter = "active" | "ended" | "all";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "endTime", label: "Thời gian kết thúc" },
  { value: "currentPrice", label: "Giá hiện tại" },
  { value: "createdAt", label: "Mới nhất" },
  { value: "bidCount", label: "Số lượt đấu giá" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Còn hạn" },
  { value: "ended", label: "Đã kết thúc" },
];

export default function SearchPageClient({
  initialProducts,
  initialKeyword,
  categories,
}: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get("keyword") || initialKeyword;
  const categoryId = searchParams.get("category");
  const currentPage = parseInt(searchParams.get("page") || "1");
  const sortBy = (searchParams.get("sortBy") as SortOption) || "endTime";
  const sortDirection =
    (searchParams.get("sortDirection") as SortDirection) || "asc";
  const status = (searchParams.get("status") as StatusFilter) || "active";

  // Fetch products when params change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await searchProducts({
          keyword: keyword || undefined,
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          status: status,
          page: currentPage - 1,
          size: 20,
          sortBy,
          sortDirection,
        });
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, categoryId, status, currentPage, sortBy, sortDirection]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/tim-kiem?${params.toString()}`);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSortBy);
    params.delete("page");
    router.push(`/tim-kiem?${params.toString()}`);
  };

  const handleDirectionChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    params.set("sortDirection", newDirection);
    params.delete("page");
    router.push(`/tim-kiem?${params.toString()}`);
  };

  const handleStatusChange = (newStatus: StatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", newStatus);
    params.delete("page");
    router.push(`/tim-kiem?${params.toString()}`);
  };

  const handleCategoryChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("category", id);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/tim-kiem?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    router.push(`/tim-kiem?${params.toString()}`);
  };

  const hasActiveFilters =
    categoryId ||
    sortBy !== "endTime" ||
    sortDirection !== "asc" ||
    status !== "active";

  return (
    <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {keyword ? `Kết quả tìm kiếm: "${keyword}"` : "Tất cả sản phẩm"}
        </h1>
        <p className="mt-2 text-gray-600">
          Tìm thấy {products.totalElements} sản phẩm
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Toggle (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:hidden"
        >
          <FiFilter className="h-4 w-4" />
          <span>Bộ lọc {hasActiveFilters && `(${categoryId ? 1 : 0})`}</span>
        </button>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <DropdownMenu
            value={status}
            options={STATUS_OPTIONS}
            isSorted={false}
            onChange={(value) => handleStatusChange(value as StatusFilter)}
            className="w-40"
          />

          {/* Sort By Dropdown */}
          <DropdownMenu
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={(value) => handleSortChange(value as SortOption)}
            className="w-52"
          />

          {/* Sort Direction Toggle */}
          <button
            onClick={handleDirectionChange}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {sortDirection === "asc" ? "Tăng dần" : "Giảm dần"}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <FiX className="h-4 w-4" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <aside
          className={`w-full lg:w-64 lg:shrink-0 ${
            showFilters ? "block" : "hidden sm:block"
          }`}
        >
          <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Bộ lọc</h2>

            <CategoryFilter
              categories={categories}
              categoryId={categoryId}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            </div>
          ) : products.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {products.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={products.totalPages}
                    onPageChange={handlePageChange}
                    isFirst={products.first}
                    isLast={products.last}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Không tìm thấy sản phẩm"
              description={
                keyword
                  ? `Không có sản phẩm nào phù hợp với "${keyword}". Thử tìm kiếm với từ khóa khác.`
                  : "Không có sản phẩm nào. Thử điều chỉnh bộ lọc của bạn."
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
