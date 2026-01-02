"use client";

import { createReview } from "@/services/reviews";
import { CreateReviewFormData, createReviewSchema } from "@/validations/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheck, FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import { toast } from "react-toastify";

interface ReviewFormProps {
  productId: number;
  productTitle: string;
  onReviewSubmitted?: () => void;
}

export const ReviewForm = ({
  productId,
  productTitle,
  onReviewSubmitted,
}: ReviewFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      productId,
    },
  });

  const onSubmit = async (data: CreateReviewFormData) => {
    try {
      setIsSubmitting(true);
      await createReview(data);
      toast.success("Cảm ơn bạn đã đánh giá!");
      setIsSubmitted(true);
      onReviewSubmitted?.();
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể gửi đánh giá";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-2 text-green-700">
          <FiCheck className="h-5 w-5" />
          <p className="font-semibold">Đã gửi đánh giá</p>
        </div>
        <p className="mt-2 text-sm text-green-600">
          Cảm ơn bạn đã chia sẻ trải nghiệm!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 font-semibold text-gray-900">Đánh giá người bán</h3>
      <p className="mb-4 text-sm text-gray-600">
        Chia sẻ trải nghiệm của bạn với sản phẩm:{" "}
        <strong>{productTitle}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden productId field */}
        <input
          type="hidden"
          {...register("productId", { valueAsNumber: true })}
        />

        {/* Rating Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Đánh giá của bạn <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                value="1"
                {...register("rating", { valueAsNumber: true })}
                className="h-4 w-4 text-green-600 focus:ring-green-500"
              />
              <FiThumbsUp className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Tích cực</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                value="-1"
                {...register("rating", { valueAsNumber: true })}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
              <FiThumbsDown className="h-5 w-5 text-red-600" />
              <span className="text-sm text-gray-700">Tiêu cực</span>
            </label>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Nhận xét (tùy chọn)
          </label>
          <textarea
            id="review-comment"
            {...register("comment")}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-900"
            placeholder="Chia sẻ trải nghiệm của bạn về người bán và sản phẩm..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600">
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
};
