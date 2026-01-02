"use client";

import { getUserReviewForProduct } from "@/services/reviews";
import { ReviewResponse } from "@/types";
import { WonProductResponse } from "@/types/profile";
import { formatPrice } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { ReviewDialog } from "../order/ReviewDialog";

interface WonProductCardProps {
  product: WonProductResponse;
}

export function WonProductCard({ product }: WonProductCardProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchReviewStatus = async () => {
      try {
        const review = await getUserReviewForProduct(product.productId);
        setExistingReview(review);
      } catch (error) {
        // Silent fail, user can still create review
      }
    };
    fetchReviewStatus();
  }, [product.productId, product.hasReviewed]);

  return (
    <>
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
              </div>
            </div>

            {/* Review Button */}
            <div className="mt-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowReviewDialog(true);
                }}
                className={`w-full cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  existingReview !== null
                    ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiStar className="h-4 w-4" />
                  <span>
                    {existingReview !== null && existingReview !== undefined
                      ? "Đánh giá lại"
                      : "Đánh giá người bán"}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </Link>

        {/* Review Dialog */}
        <ReviewDialog
          isOpen={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          productId={product.productId}
          productTitle={product.title}
          title="Đánh giá người bán"
          hasReviewed={existingReview !== null}
          existingReview={existingReview}
          onReviewSubmitted={async () => {
            const review = await getUserReviewForProduct(product.productId);
            setExistingReview(review);
          }}
        />
      </div>
    </>
  );
}
