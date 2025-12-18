"use client";

import { WonProductResponse } from "@/types/profile";
import { formatFullDateTime, formatPrice } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiUser } from "react-icons/fi";

interface WonProductCardProps {
  product: WonProductResponse;
}

export function WonProductCard({ product }: WonProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg">
      <Link href={`/san-pham/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Won Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
              <FiStar className="h-3.5 w-3.5 fill-white" />
              Đã thắng
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-black">
            {product.title}
          </h3>

          <div className="mb-3 space-y-2">
            {/* Winning Bid */}
            <div>
              <p className="text-xs text-gray-500">Giá thắng đấu giá</p>
              <p className="text-lg font-bold text-green-600">
                {formatPrice(product.winningBid)}
              </p>
            </div>

            {/* Seller Info */}
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                    {product.sellerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Người bán</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {product.sellerName}
                    </p>
                  </div>
                </div>
                <FiUser className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500">
              Kết thúc: {formatFullDateTime(product.endTime)}
            </div>
          </div>

          {/* Review Status */}
          {!product.hasReviewed && (
            <div className="mt-3">
              <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800">
                <div className="flex items-center justify-center gap-2">
                  <FiStar className="h-4 w-4" />
                  <span>Đánh giá người bán</span>
                </div>
              </button>
            </div>
          )}
          {product.hasReviewed && (
            <div className="mt-3 rounded-lg bg-green-50 px-4 py-2 text-center text-xs font-semibold text-green-700">
              Đã đánh giá
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
