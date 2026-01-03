"use client";

import { useScrollLock } from "@/hooks";
import {
  createReview,
  deleteReview,
  getRevieweeProfile,
  updateReview,
} from "@/services/reviews";
import { RevieweeProfileResponse, ReviewResponse } from "@/types";
import {
  CreateReviewFormData,
  createReviewSchema,
  UpdateReviewFormData,
  updateReviewSchema,
} from "@/validations/review";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCheckCircle,
  FiStar,
  FiThumbsDown,
  FiThumbsUp,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ConfirmDialog } from "../common";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
  title?: string;
  hasReviewed?: boolean; // if this is true, use update review api, otherwise use create review api
  existingReview?: ReviewResponse | null;
  onReviewSubmitted?: () => void;
}

export const ReviewDialog = ({
  isOpen,
  onClose,
  productId,
  productTitle,
  title = "Đánh giá",
  hasReviewed = false,
  existingReview = null,
  onReviewSubmitted,
}: ReviewDialogProps) => {
  useScrollLock(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewee, setReviewee] = useState<RevieweeProfileResponse | null>(
    null,
  );
  const [loadingProfile, setLoadingProfile] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateReviewFormData | UpdateReviewFormData>({
    resolver: zodResolver(
      hasReviewed ? updateReviewSchema : createReviewSchema,
    ),
    defaultValues: hasReviewed
      ? {}
      : {
          productId,
        },
  });

  // Pre-fill form with existing review data when dialog opens
  useEffect(() => {
    if (isOpen && existingReview) {
      setValue("rating", existingReview.rating);
      setValue("comment", existingReview.comment || "");
    }
  }, [isOpen, existingReview, setValue]);

  // Fetch reviewee profile when dialog opens
  useEffect(() => {
    if (isOpen && productId) {
      const fetchProfile = async () => {
        try {
          setLoadingProfile(true);
          const profile = await getRevieweeProfile(productId);
          setReviewee(profile);
        } catch (error: any) {
          console.error("Failed to fetch reviewee profile:", error);
          // Don't show error toast, just continue without profile data
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchProfile();
    }
  }, [isOpen, productId]);

  const onSubmit = async (
    data: CreateReviewFormData | UpdateReviewFormData,
  ) => {
    try {
      setIsSubmitting(true);
      if (hasReviewed) {
        // Update existing review
        await updateReview(productId, data as UpdateReviewFormData);
        toast.success("Đã cập nhật đánh giá!");
      } else {
        // Create new review
        await createReview(data as CreateReviewFormData);
        toast.success("Cảm ơn bạn đã đánh giá!");
      }
      reset();
      onClose();
      onReviewSubmitted?.();
    } catch (error: any) {
      console.error("❌ Review submission error:", error);
      const errorMessage = error?.message || "Không thể gửi đánh giá";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteReview(productId);
      toast.success("Đã xóa đánh giá!");
      reset();
      onClose();
      onReviewSubmitted?.();
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể xóa đánh giá";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Đóng"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Product Info */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-1 text-sm font-medium text-gray-600">Sản phẩm</p>
            <p className="text-lg font-bold text-gray-900">{productTitle}</p>
          </div>

          {/* Reviewee Profile */}
          {loadingProfile ? (
            <div className="mb-6 flex items-center justify-center gap-4 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
              <p>Đang tải thông tin người nhận đánh giá...</p>
            </div>
          ) : (
            reviewee && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {reviewee.avatarUrl ? (
                      <Image
                        src={reviewee.avatarUrl}
                        alt={reviewee.fullName}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                        {reviewee.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {reviewee.fullName}
                    </p>
                    {reviewee.totalRatings > 0 ? (
                      <div className="mt-1 flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-900">
                            {reviewee.ratingPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <FiCheckCircle className="h-3 w-3 text-green-600" />
                            {reviewee.positiveRating}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiXCircle className="h-3 w-3 text-red-600" />
                            {reviewee.negativeRating}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        Chưa có đánh giá
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Review Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Hidden productId field - only for create mode */}
            {!hasReviewed && (
              <input
                type="hidden"
                {...register("productId", { valueAsNumber: true })}
              />
            )}

            {/* Rating Selection */}
            <div>
              <label className="mb-3 block text-base font-semibold text-gray-900">
                Đánh giá của bạn <span className="text-red-500">*</span>
              </label>
              {errors.rating && (
                <p className="mb-2 text-sm text-red-600">
                  {errors.rating.message}
                </p>
              )}
              <div className="flex gap-4">
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:border-green-500 hover:bg-green-50 has-checked:border-green-600 has-checked:bg-green-50">
                  <input
                    type="radio"
                    value={1}
                    name="rating"
                    defaultChecked={existingReview?.rating === 1}
                    onChange={(e) => {
                      const numValue = Number(e.target.value);
                      setValue("rating", numValue, { shouldValidate: true });
                    }}
                    className="h-5 w-5 text-green-600 focus:ring-green-500"
                  />
                  <FiThumbsUp className="h-6 w-6 text-green-600" />
                  <span className="font-semibold text-gray-900">Tích cực</span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:border-red-500 hover:bg-red-50 has-checked:border-red-600 has-checked:bg-red-50">
                  <input
                    type="radio"
                    value={-1}
                    name="rating"
                    defaultChecked={existingReview?.rating === -1}
                    onChange={(e) => {
                      const numValue = Number(e.target.value);
                      setValue("rating", numValue, { shouldValidate: true });
                    }}
                    className="h-5 w-5 text-red-600 focus:ring-red-500"
                  />
                  <FiThumbsDown className="h-6 w-6 text-red-600" />
                  <span className="font-semibold text-gray-900">Tiêu cực</span>
                </label>
              </div>
              {errors.rating && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.rating.message}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="review-comment"
                className="mb-2 block text-base font-semibold text-gray-900"
              >
                Nhận xét (tùy chọn)
              </label>
              <textarea
                id="review-comment"
                {...register("comment")}
                rows={4}
                className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 transition-colors focus:border-gray-900 focus:ring-0 focus:outline-none"
                placeholder="Chia sẻ trải nghiệm của bạn về người bán và sản phẩm..."
              />
              {errors.comment && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.comment.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {existingReview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleting}
                  className="cursor-pointer rounded-lg border-2 border-red-300 bg-white px-6 py-3 font-semibold text-red-600 transition-all hover:border-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
                className="flex-1 cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isDeleting}
                className="flex-1 cursor-pointer rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa đánh giá"
        message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};
