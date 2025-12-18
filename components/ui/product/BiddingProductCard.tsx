"use client";

import { BiddingProductResponse } from "@/types/profile";
import { calculateCountdown, formatFullDateTime, formatPrice } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiClock, FiTrendingUp } from "react-icons/fi";
import { RiAuctionFill } from "react-icons/ri";

interface BiddingProductCardProps {
  product: BiddingProductResponse;
}

export function BiddingProductCard({ product }: BiddingProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

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

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.thumbnailUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Winning Badge */}
        {product.isWinning && !product.isEnded && (
          <div className="absolute top-3 left-3 z-10">
            <span className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
              <FiTrendingUp className="h-3.5 w-3.5" />
              Đang dẫn đầu
            </span>
          </div>
        )}

        {/* Ended Overlay */}
        {product.isEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-center">
              <span className="block rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
                ĐÃ KẾT THÚC
              </span>
              {product.isWinning ? (
                <span className="mt-2 block text-xs font-semibold text-green-400">
                  Bạn đã thắng!
                </span>
              ) : (
                <span className="mt-2 block text-xs font-semibold text-red-400">
                  Bạn đã thua
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-black">
          {product.title}
        </h3>

        <div className="mb-3 space-y-2">
          {/* Current Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Giá hiện tại</p>
              <p className="text-lg font-bold text-black">
                {formatPrice(product.currentPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Giá đấu của bạn</p>
              <p
                className={`text-sm font-semibold ${
                  product.isWinning ? "text-green-600" : "text-gray-700"
                }`}
              >
                {formatPrice(product.userHighestBid)}
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          {!product.isEnded && (
            <div
              className={`rounded-lg px-2 py-1 text-center text-xs font-semibold ${
                product.isWinning
                  ? "bg-green-50 text-green-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              {product.isWinning
                ? "Bạn đang có giá cao nhất"
                : "Có người đấu giá cao hơn"}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <RiAuctionFill className="h-3.5 w-3.5" />
            <span>{product.bidCount} lượt đấu giá</span>
          </div>
          {!product.isEnded ? (
            <div
              className={`flex items-center gap-1 text-xs ${
                isUrgent ? "font-semibold text-red-600" : "text-gray-600"
              }`}
              title={`Sẽ kết thúc vào ${formatFullDateTime(product.endTime)}`}
            >
              <FiClock className="h-3.5 w-3.5" />
              <span>{timeLeft}</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              {formatFullDateTime(product.endTime)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
