"use client";

import { BiddingProductCard, Pagination } from "@/components/ui";
import { getBiddingProducts } from "@/services/profile";
import { BiddingProductResponse } from "@/types/profile";
import Image from "next/image";
import { useEffect, useState } from "react";

export function BiddingActiveTab() {
  const [products, setProducts] = useState<BiddingProductResponse[]>([]);
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
      const response = await getBiddingProducts(page);
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Failed to load bidding products:", error);
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Sản phẩm đang đấu giá
        </h2>
        <p className="text-sm text-gray-600">{totalElements} sản phẩm</p>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <Image
            src="/empty-bidding.png"
            alt="No Bidding"
            height={150}
            width={150}
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Chưa có sản phẩm đang đấu giá
          </h3>
          <p className="mt-2 text-gray-600">
            Tham gia đấu giá để theo dõi sản phẩm tại đây
          </p>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((item) => (
              <BiddingProductCard key={item.productId} product={item} />
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
