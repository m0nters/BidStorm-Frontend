import { SellerActiveProductResponse } from "@/types";
import { calculateCountdown, formatFullDateTime, formatPrice } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { RiAuctionFill } from "react-icons/ri";

export function SellerActiveProductCard({
  product,
}: {
  product: SellerActiveProductResponse;
}) {
  const router = useRouter();
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
            {product.buyNowPrice && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Mua ngay</p>
                <p className="text-sm font-semibold text-blue-600">
                  {formatPrice(product.buyNowPrice)}
                </p>
              </div>
            )}
          </div>

          {/* Bid Count */}
          <div className="flex items-center gap-1.5 text-gray-600">
            <RiAuctionFill className="h-4 w-4" />
            <span className="text-sm">
              {product.bidCount === 0
                ? "Chưa có lượt đấu giá"
                : `${product.bidCount} lượt đấu giá`}
            </span>
          </div>

          {/* Countdown */}
          <div
            className={`flex items-center gap-1.5 ${
              isUrgent ? "text-red-600" : "text-gray-600"
            }`}
          >
            <FiClock className="h-4 w-4" />
            <span
              className="text-sm"
              title={formatFullDateTime(product.endTime)}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="mt-3 flex gap-1 border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-black">Danh mục: </p>

          <span
            className="cursor-pointer text-xs font-medium text-gray-700 hover:text-black hover:underline"
            onClick={(e) => {
              e.stopPropagation(); // ← Very important!
              router.push(`/danh-muc/${product.categorySlug}`);
            }}
          >
            {product.categoryName}
          </span>
        </div>
      </div>
    </Link>
  );
}
