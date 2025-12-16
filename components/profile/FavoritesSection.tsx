"use client";

import { getFavorites } from "@/services/profile";
import { FavoriteProductResponse } from "@/types/profile";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FavoriteProductCard } from "./FavoriteProductCard";

export function FavoritesSection() {
  const [favorites, setFavorites] = useState<FavoriteProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 12;

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavorites(page, size);
      setFavorites(response.content);
      setTotalPages(response.page.totalPages);
      setTotalElements(response.page.totalElements);
    } catch (error) {
      console.error("Failed to load favorites:", error);
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

  if (favorites.length === 0) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Sản phẩm yêu thích
        </h2>
        <div className="flex flex-col items-center py-12 text-center">
          <Image
            src="/empty-favorites.png"
            alt="No Favorites"
            height={128}
            width={128}
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Chưa có sản phẩm yêu thích
          </h3>
          <p className="mt-2 text-gray-600">
            Các sản phẩm bạn đã lưu sẽ xuất hiện ở đây
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sản phẩm yêu thích</h2>
        <p className="text-sm text-gray-600">{totalElements} sản phẩm</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((item) => (
          <FavoriteProductCard key={item.productId} product={item} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-10 w-10 rounded-lg font-semibold transition-all ${
                  page === i
                    ? "bg-black text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages - 1}
            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
