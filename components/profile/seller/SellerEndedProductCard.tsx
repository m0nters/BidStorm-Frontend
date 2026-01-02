import { ConfirmDialog } from "@/components/ui";
import { ReviewDialog } from "@/components/ui/order/ReviewDialog";
import { getUserReviewForProduct } from "@/services/reviews";
import { SellerEndedProductResponse } from "@/types";
import { ReviewResponse } from "@/types/review";
import { formatFullDateTime, formatPrice } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiStar } from "react-icons/fi";

export function SellerEndedProductCard({
  product,
  onCancelOrder,
  onReviewSubmitted,
}: {
  product: SellerEndedProductResponse;
  onCancelOrder: (orderId: number) => Promise<void>;
  onReviewSubmitted?: () => void;
}) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewResponse | null>(
    null,
  );
  const [loadingReview, setLoadingReview] = useState(false);

  const hasWinner = product.winnerId !== null && product.winnerId !== undefined;
  const ratingPercentage = hasWinner
    ? ((product.winnerPositiveRating || 0) /
        ((product.winnerPositiveRating || 0) +
          (product.winnerNegativeRating || 0))) *
      100
    : 0;

  const handleCancelClick = async () => {
    if (!product.orderStatus || !product.orderId) return;

    setIsCancelling(true);
    try {
      await onCancelOrder(product.orderId);
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Link
        href={`/san-pham/${product.slug}`}
        className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-3 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-black">
            {product.title}
          </h3>

          {/* Price Info */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Giá khởi điểm</p>
              <p className="text-sm font-semibold text-gray-700">
                {formatPrice(product.startingPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Giá cuối cùng</p>
              <p className="text-lg font-bold text-black">
                {formatPrice(product.finalPrice)}
              </p>
            </div>
          </div>

          {/* Winner Info */}
          {hasWinner ? (
            <div className="mb-3 rounded-lg bg-gray-50 p-3">
              <p className="mb-1 text-xs font-semibold text-gray-700">
                Người thắng
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {product.winnerName}
                </p>
                <div className="flex shrink-0 items-center gap-1 text-xs text-yellow-600">
                  <FiStar className="h-3.5 w-3.5 fill-current" />
                  <span className="font-semibold">
                    {ratingPercentage.toFixed(0)}%
                  </span>
                  <span className="text-gray-500">
                    ({product.winnerPositiveRating || 0}+/
                    {product.winnerNegativeRating || 0}-)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-3 rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">Không có người thắng</p>
            </div>
          )}

          {/* End Time */}
          <div className="mb-3 text-xs text-gray-500">
            Kết thúc: {formatFullDateTime(product.endTime)}
          </div>

          {/* Order Status & Actions */}
          <div className="space-y-2 border-t border-gray-100 pt-3">
            {/* Order Status Badge */}
            {product.orderStatus && (
              <div className="flex justify-center">
                <span
                  className={`w-full rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                    product.orderStatus === "PENDING_PAYMENT"
                      ? "bg-yellow-100 text-yellow-700"
                      : product.orderStatus === "PAID"
                        ? "bg-blue-100 text-blue-700"
                        : product.orderStatus === "SHIPPED"
                          ? "bg-purple-100 text-purple-700"
                          : product.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {product.orderStatus === "PENDING_PAYMENT"
                    ? "Trạng thái: Chờ thanh toán"
                    : product.orderStatus === "PAID"
                      ? "Trạng thái: Đã thanh toán"
                      : product.orderStatus === "SHIPPED"
                        ? "Trạng thái: Đã gửi hàng"
                        : product.orderStatus === "DELIVERED"
                          ? "Trạng thái: Đã giao hàng"
                          : product.orderStatus}
                </span>
              </div>
            )}

            {/* Review Button */}
            {hasWinner && (
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    setLoadingReview(true);
                    if (product.hasReviewed) {
                      const review = await getUserReviewForProduct(
                        product.productId,
                      );
                      setExistingReview(review);
                    } else {
                      setExistingReview(null);
                    }
                    setShowReviewDialog(true);
                  } catch (err) {
                    console.error("Failed to load review:", err);
                  } finally {
                    setLoadingReview(false);
                  }
                }}
                className="w-full cursor-pointer rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
              >
                {product.hasReviewed ? "Đánh giá lại" : "Đánh giá người mua"}
              </button>
            )}

            {/* Cancel Order Button */}
            {product.orderStatus === "PENDING_PAYMENT" && product.orderId && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowCancelDialog(true);
                }}
                className="w-full cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Xác nhận hủy đơn hàng"
        message={
          <>
            Bạn có chắc chắn muốn hủy đơn hàng này? Người thắng sẽ tự động bị
            đánh giá <strong>-1 điểm</strong> với nhận xét{" "}
            <strong>&quot;Người thắng không thanh toán&quot;</strong>.
          </>
        }
        confirmText={isCancelling ? "Đang hủy..." : "Xác nhận hủy"}
        cancelText="Không"
        onConfirm={handleCancelClick}
        onCancel={() => setShowCancelDialog(false)}
      />

      {/* Review Dialog */}
      {hasWinner && (
        <ReviewDialog
          isOpen={showReviewDialog}
          onClose={() => {
            setShowReviewDialog(false);
            setExistingReview(null);
          }}
          productId={product.productId}
          productTitle={product.title}
          title={
            product.hasReviewed
              ? "Đánh giá lại người mua"
              : "Đánh giá người mua"
          }
          hasReviewed={product.hasReviewed}
          existingReview={existingReview}
          onReviewSubmitted={() => {
            setShowReviewDialog(false);
            setExistingReview(null);
            onReviewSubmitted?.();
          }}
        />
      )}
    </>
  );
}
