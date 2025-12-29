"use client";

import { ProductListResponse } from "@/types/product";
import {
  calculateCountdown,
  formatDateForFeed,
  formatFullDateTime,
  formatPrice,
} from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiClock, FiShoppingCart } from "react-icons/fi";
import { RiAuctionFill } from "react-icons/ri";
import { FavoriteButton } from "./FavoriteButton";

interface ProductCardProps {
  product: ProductListResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  // Real time countdown
  useEffect(() => {
    const updateCountdown = () => {
      const { timeLeft, isUrgent } = calculateCountdown(product.endTime);
      setTimeLeft(timeLeft);
      setIsUrgent(isUrgent);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [product.endTime]);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to product detail page with highlight parameter
    router.push(`/san-pham/${product.slug}?highlight=buyNow`);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-100">
      <Link href={`/san-pham/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Product Image */}
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute right-3 bottom-3 flex flex-col gap-2">
            <div className="flex flex-col items-end justify-center gap-2">
              {product.isNew && (
                <span className="w-fit rounded-lg bg-black px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  MỚI
                </span>
              )}
              {product.buyNowPrice &&
                new Date(product.endTime) > new Date() && (
                  <span className="w-fit rounded-lg bg-white px-3 py-1 text-xs font-semibold text-black shadow-lg">
                    CÓ THỂ MUA NGAY
                  </span>
                )}
            </div>
          </div>

          {/* Wishlist Button - Only show when authenticated */}
          <FavoriteButton
            productId={product.id}
            className="absolute top-3 right-3"
          />
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Category */}
          <Link
            href={`/danh-muc/${product.categorySlug}`}
            onClick={(e) => e.stopPropagation()}
            className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase hover:text-black hover:underline"
          >
            {product.categoryName}
          </Link>

          {/* Title */}
          <h3
            className="mb-3 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-black"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Created At */}
          <div
            className="mb-3 flex items-center gap-1.5 text-xs text-gray-500"
            title={formatFullDateTime(product.createdAt)}
          >
            <FiClock className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              Đã đăng: {formatDateForFeed(product.createdAt)}
            </span>
          </div>

          {/* Current Price */}
          <div className="mb-4">
            <p className="mb-1 text-xs font-medium text-gray-500">
              Giá hiện tại
            </p>
            {product.currentPrice > product.startingPrice && (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(product.startingPrice)}
              </p>
            )}
            <p className="text-2xl font-bold text-black">
              {formatPrice(product.currentPrice)}
            </p>
            {product.currentPrice > product.startingPrice && (
              <p className="text-xs font-semibold text-green-600">
                +{formatPrice(product.currentPrice - product.startingPrice)}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="mb-4 border-t border-gray-100" />

          {/* Seller Info */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                {product.sellerName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs font-medium text-gray-900"
                  title={product.sellerName}
                >
                  {product.sellerName.length > 15
                    ? product.sellerName.substring(0, 15) + "..."
                    : product.sellerName}
                </span>
                {product.sellerRating !== null && (
                  <span className="text-xs text-gray-500">
                    Đánh giá: {product.sellerRating.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bids Count */}
          <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <RiAuctionFill className="h-3.5 w-3.5" />
              <span className="font-medium text-gray-900">
                {product.bidCount > 0
                  ? `${product.bidCount} lượt đấu giá`
                  : "Chưa có lượt đấu giá"}
              </span>
            </div>
            {product.highestBidderName && (
              <p className="mt-1 text-xs text-gray-600">
                Cao nhất: {product.highestBidderName} (
                {product.highestBidderRating?.toFixed(2)}%)
              </p>
            )}
          </div>

          {/* Time Left */}
          <div
            className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
              isUrgent ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
            }`}
            title={`Sẽ kết thúc vào ${formatFullDateTime(product.endTime)}`}
          >
            <FiClock className="h-4 w-4" />
            <span>Còn lại: {timeLeft}</span>
          </div>

          {/* Additional Info */}
          <div className="mb-4 space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <span className="text-gray-600">Xét đánh giá để đấu giá</span>
              <span
                className={`font-semibold ${
                  !product.allowUnratedBidders
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {!product.allowUnratedBidders ? "Có" : "Không"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tự động gia hạn</span>
              <span
                className={`font-semibold ${
                  product.autoExtend ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {product.autoExtend ? "Có" : "Không"}
              </span>
            </div>
          </div>

          {/* Buy Now Button */}
          {product.buyNowPrice && new Date(product.endTime) > new Date() && (
            <button
              onClick={handleBuyNow}
              className="group/buy w-full cursor-pointer rounded-lg bg-black py-2 text-white transition-all duration-200 hover:scale-105"
            >
              <p>Mua ngay</p>
              <span className="flex items-center justify-center gap-4">
                <FiShoppingCart className="h-4 w-4 transition-transform group-hover/buy:-translate-x-1" />
                <p className="transition-transform group-hover/buy:translate-x-0.5">
                  {formatPrice(product.buyNowPrice)}
                </p>
              </span>
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}
