"use client";

import { ReviewResponse } from "@/types";
import { formatFullDateTime } from "@/utils";
import { UpdateReviewFormData } from "@/validations/review";
import Image from "next/image";
import Link from "next/link";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FiEdit2, FiThumbsDown, FiThumbsUp, FiTrash2 } from "react-icons/fi";

interface ReviewCardProps {
  review: ReviewResponse;
  isEditing: boolean;
  canEdit: boolean;
  isSubmitting: boolean;
  tabType: "given" | "received";
  register: UseFormRegister<UpdateReviewFormData>;
  errors: FieldErrors<UpdateReviewFormData>;
  setValue: UseFormSetValue<UpdateReviewFormData>;
  onEdit: (review: ReviewResponse) => void;
  onDelete: (reviewId: number) => void;
  onUpdate: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export const ReviewCard = ({
  review,
  isEditing,
  canEdit,
  isSubmitting,
  tabType,
  register,
  errors,
  setValue,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
}: ReviewCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="flex gap-4 p-4">
        {/* Product Thumbnail - Clickable */}
        <Link href={`san-pham/${review.productUrl}`}>
          <Image
            src={review.thumbnailUrl}
            alt={review.productTitle}
            width={110}
            height={110}
            className="rounded-lg object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Product Title - Clickable */}
              <Link
                href={`san-pham/${review.productUrl}`}
                className="mb-1 block font-semibold text-gray-900 hover:text-black hover:underline"
              >
                {`${review.productTitle}${review.isYourProduct ? " (Bạn bán)" : ""}`}
              </Link>
              <div className="flex flex-col items-start gap-2 text-sm text-gray-600">
                <span>
                  {tabType === "given"
                    ? `Đánh giá: ${review.reviewerName}${review.isYourProduct ? " (Người mua)" : " (Người bán)"}`
                    : `Người đánh giá: ${review.reviewerName}${review.isYourProduct ? " (Người mua)" : " (Người bán)"}`}
                </span>
                <span>{formatFullDateTime(review.createdAt)}</span>
              </div>
            </div>
            {canEdit && !isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(review)}
                  className="cursor-pointer rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  title="Chỉnh sửa"
                >
                  <FiEdit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(review.id)}
                  className="cursor-pointer rounded p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                  title="Xóa"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Rating and Comment */}
          {isEditing ? (
            <form onSubmit={onUpdate} className="space-y-3">
              {/* Rating Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Đánh giá
                </label>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      value={1}
                      name="rating"
                      onChange={(e) => {
                        setValue("rating", Number(e.target.value), {
                          shouldValidate: true,
                        });
                      }}
                      defaultChecked={review.rating === 1}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <FiThumbsUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Tích cực</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      value={-1}
                      name="rating"
                      onChange={(e) => {
                        setValue("rating", Number(e.target.value), {
                          shouldValidate: true,
                        });
                      }}
                      defaultChecked={review.rating === -1}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <FiThumbsDown className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-gray-700">Tiêu cực</span>
                  </label>
                </div>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor={`comment-${review.id}`}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nhận xét (tùy chọn)
                </label>
                <textarea
                  id={`comment-${review.id}`}
                  {...register("comment")}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900"
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                />
                {errors.comment && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  type="button"
                  onClick={onCancelEdit}
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 border-t border-gray-200 pt-3">
              {/* Display Rating */}
              <div className="flex items-center gap-2">
                {review.rating === 1 ? (
                  <>
                    <div className="rounded-full bg-green-100 p-1.5">
                      <FiThumbsUp className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      Tích cực
                    </span>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-red-100 p-1.5">
                      <FiThumbsDown className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      Tiêu cực
                    </span>
                  </>
                )}
              </div>

              {/* Display Comment */}
              {review.comment ? (
                <p className="ml-1 border-l-8 border-gray-300 pl-3 text-sm leading-relaxed text-gray-700 italic">
                  {review.comment}
                </p>
              ) : (
                <p className="text-sm leading-relaxed text-gray-700 italic">
                  (Chưa có nhận xét)
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
