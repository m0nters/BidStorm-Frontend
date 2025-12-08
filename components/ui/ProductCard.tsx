"use client";

import { formatPrice } from "@/lib/utils";
import { ProductListResponse } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiClock, FiHeart, FiShoppingCart } from "react-icons/fi";

interface ProductCardProps {
  product: ProductListResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(product.endTime).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft("Đã kết thúc");
        setIsUrgent(false);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Mark as urgent if less than 24 hours
      setIsUrgent(hours < 24);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days} ngày`);
      } else if (hours > 0) {
        setTimeLeft(
          `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`,
        );
      } else {
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [product.endTime]);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Call API to update wishlist
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-lg">
      <Link href={`/san-pham/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Product Image */}
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {product.isNew && (
              <span className="rounded bg-black px-2 py-1 text-xs font-semibold text-white">
                MỚI
              </span>
            )}
            {product.hasBuyNow && (
              <span className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                MUA NGAY
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist();
            }}
            className="absolute top-2 right-2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50"
          >
            <FiHeart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 transition-colors hover:text-blue-600">
            {product.title}
          </h3>

          {/* Category */}
          <p className="mb-2 text-xs text-gray-500">{product.categoryName}</p>

          {/* Current Price */}
          <div className="mb-3">
            <p className="mb-1 text-xs text-gray-500">Giá hiện tại</p>
            <p className="text-xl font-bold text-black">
              {formatPrice(product.currentPrice)}
            </p>
          </div>

          {/* Seller Info */}
          <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-end">
              <span className="text-xs">Người bán: </span>
              <span className="ml-1 translate-y-px font-medium">
                {product.sellerName}
              </span>
              {product.sellerRating !== null && (
                <span className="ml-1 text-xs text-green-600">
                  ({product.sellerRating}%)
                </span>
              )}
            </div>
          </div>

          {/* Bids Count */}
          <div className="mb-3 flex items-center text-sm text-gray-600">
            <span>
              {product.bidCount > 0
                ? `${product.bidCount} lượt`
                : "Chưa có lượt ra giá"}
            </span>
            {product.highestBidderName && (
              <span className="ml-2 text-xs">
                • Cao nhất: {product.highestBidderName}
              </span>
            )}
          </div>

          {/* Time Left */}
          <div
            className={`mb-3 flex items-center gap-2 text-sm ${
              isUrgent ? "font-semibold text-red-600" : "text-gray-600"
            }`}
          >
            <FiClock className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>

          {/* Allow unrated bidders to bid on products? */}
          <p className="mb-3 text-xs text-gray-600">
            Cho phép người đấu giá CHƯA có đánh giá được đấu giá: <br />
            <span
              className={`font-semibold ${
                product.allowUnratedBidders ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.allowUnratedBidders ? "Cho phép" : "Không"}
            </span>
          </p>

          {/* Buy Now Button */}
          {product.hasBuyNow && product.buyNowPrice && (
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Handle buy now
              }}
              className="group w-full cursor-pointer rounded-lg bg-black py-2 text-white transition-all duration-200 hover:scale-105"
            >
              <p>Giá mua ngay</p>
              <span className="flex items-center justify-center gap-4">
                <FiShoppingCart className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <p className="transition-transform group-hover:translate-x-0.5">
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
