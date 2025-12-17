"use client";

import { addFavorite, isFavorite, removeFavorite } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";

interface FavoriteButtonProps {
  productId: number;
  className?: string;
  onFavoriteChange?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  productId,
  className = "",
  onFavoriteChange,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Check if product is favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) {
        setIsChecking(false);
        return;
      }

      try {
        const favorited = await isFavorite(productId);
        setIsFavorited(favorited);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFavoriteStatus();
  }, [productId, isAuthenticated]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(productId);
        setIsFavorited(false);
        onFavoriteChange?.(false);
      } else {
        await addFavorite(productId);
        setIsFavorited(true);
        onFavoriteChange?.(true);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading || isChecking}
      className={`cursor-pointer rounded-full p-2.5 shadow-lg backdrop-blur-sm transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${className} ${
        isFavorited
          ? "bg-black hover:bg-gray-800"
          : "bg-white hover:bg-gray-100"
      }`}
      title={isFavorited ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
    >
      <FiHeart
        className={`h-5 w-5 transition-colors ${
          isFavorited
            ? "fill-white text-white"
            : "text-gray-600 hover:text-black"
        }`}
      />
    </button>
  );
}
