"use client";

import { Pagination } from "@/components/ui";
import { cancelOrder } from "@/services/orders";
import { getSellerEndedProducts } from "@/services/products";
import { SellerEndedProductResponse } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SellerEndedProductCard } from "./SellerEndedProductCard";

export function SellerEndedTab() {
  const router = useRouter();
  const [products, setProducts] = useState<SellerEndedProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getSellerEndedProducts({ page, size: 9 });
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Failed to load ended products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await cancelOrder(orderId);
      toast.success("Đã hủy đơn hàng thành công");

      // Reload products to update the list
      loadProducts();
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể hủy đơn hàng";
      toast.error(errorMessage);
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
          Sản phẩm đã kết thúc và đã có nguời thắng
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
            Chưa có sản phẩm đã kết thúc
          </h3>
          <p className="mt-2 text-gray-600">
            Các sản phẩm đã kết thúc đấu giá sẽ hiển thị ở đây
          </p>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <SellerEndedProductCard
                key={product.productId}
                product={product}
                onCancelOrder={handleCancelOrder}
                onReviewSubmitted={loadProducts}
              />
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
