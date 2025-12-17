"use client";

import { FavoriteProductCard, Pagination } from "@/components/ui";
import { getFavorites } from "@/services/profile";
import { FavoriteProductResponse } from "@/types/profile";
import Image from "next/image";
import { useEffect, useState } from "react";

export function FavoritesSection() {
  const [favorites, setFavorites] = useState<FavoriteProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavorites(page);
      setFavorites(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (productId: number) => {
    // In case the logic is getting out of hand, just call `loadFavorites()`.
    // Currently I'm (trying) handling this in memory for better efficiency.
    // (think about it, otherwise we have to fetch ALL the data just for one removal)

    setFavorites((prev) => prev.filter((item) => item.productId !== productId));
    setTotalElements((prev) => prev - 1);

    // If the current page becomes empty after removal, go to the previous page
    if (favorites.length === 1 && page > 0) {
      setPage(page - 1);
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
          <FavoriteProductCard
            key={item.productId}
            product={item}
            onRemove={handleRemoveFavorite}
          />
        ))}
      </div>

      <Pagination
        currentPage={page + 1}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage - 1)}
        isFirst={page === 0}
        isLast={page === totalPages - 1}
        className="mt-8"
      />
    </div>
  );
}
