"use client";

import { CategoryTree } from "@/components/ui/category/";
import { Pagination } from "@/components/ui/common/";
import { EmptyState, ProductCard } from "@/components/ui/product/";
import { PaginatedResponse } from "@/types/api";
import { CategoryResponse } from "@/types/category";
import { ProductListResponse } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryPageClientProps {
  category: CategoryResponse;
  allCategories: CategoryResponse[];
  initialProducts: PaginatedResponse<ProductListResponse>;
}

export default function CategoryPageClient({
  category,
  allCategories,
  initialProducts,
}: CategoryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/danh-muc/${category.slug}?${params.toString()}`);
  };

  return (
    <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Sidebar - Category Tree */}
        <aside className="w-full lg:w-64 lg:shrink-0">
          <div className="sticky top-24">
            <CategoryTree
              categories={allCategories}
              currentCategoryId={category.id}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {initialProducts.totalElements} sản phẩm
            </p>
          </div>

          {/* Products Grid */}
          {initialProducts.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {initialProducts.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={initialProducts.totalPages}
                  onPageChange={handlePageChange}
                  isFirst={initialProducts.first}
                  isLast={initialProducts.last}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="Không tìm thấy sản phẩm"
              description="Hiện tại không có sản phẩm nào trong danh mục này. Vui lòng quay lại sau hoặc khám phá các danh mục khác."
            />
          )}
        </main>
      </div>
    </div>
  );
}
