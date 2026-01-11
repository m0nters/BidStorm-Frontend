"use client";

import { Pagination } from "@/components/ui";
import { getSellerActiveProducts } from "@/services/products";
import { SellerActiveProductResponse } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SellerActiveProductCard } from "./SellerActiveProductCard";

export function SellerActiveTab() {
  const router = useRouter();
  const [products, setProducts] = useState<SellerActiveProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getSellerActiveProducts({ page, size: 9 });
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Failed to load active products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Sản phẩm đang đăng và còn hạn
        </h2>
        <button
          onClick={() => router.push("/dang-san-pham")}
          aria-label="Đăng sản phẩm"
          className="mb-4 cursor-pointer rounded-md bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Đăng sản phẩm mới
        </button>
      </div>

      <p className="mb-6 text-sm text-gray-600">{totalElements} sản phẩm</p>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <Image
            src="/no-products-found.png"
            alt="Không tìm thấy sản phẩm"
            width={200}
            height={318}
            priority
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Chưa có sản phẩm đang đăng
          </h3>
          <p className="mt-2 text-gray-600">
            Đăng sản phẩm để bắt đầu bán hàng
          </p>
          <Link
            href="/dang-san-pham"
            className="mt-4 rounded-lg bg-black px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Đăng sản phẩm
          </Link>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <SellerActiveProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page + 1}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage - 1)}
                isFirst={page === 0}
                isLast={page === totalPages - 1}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
