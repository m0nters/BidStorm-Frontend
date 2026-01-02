"use client";

import { getUserReviews } from "@/services/reviews";
import { ReviewResponse } from "@/types";
import { UpdateReviewFormData } from "@/validations/review";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Pagination } from "../../ui/common";
import { ReviewCard } from "./ReviewCard";

export function ReviewsReceivedTab() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dummy form hook for ReviewCard (not used but required)
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<UpdateReviewFormData>();

  const fetchReviews = async (page = 0) => {
    try {
      setLoading(true);
      const data = await getUserReviews(page, 10);
      setReviews(data.content);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể tải danh sách đánh giá";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(0);
  }, []);

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="mb-2 text-xl font-semibold text-gray-900">
          Chưa có đánh giá nào
        </p>
        <p className="text-gray-600">Bạn chưa nhận được đánh giá nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Review Cards - Read Only */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isEditing={false}
            canEdit={false}
            isSubmitting={false}
            tabType="received"
            register={register}
            errors={errors}
            setValue={setValue}
            onEdit={() => {}}
            onDelete={() => {}}
            onUpdate={() => {}}
            onCancelEdit={() => {}}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isFirst={currentPage === 0}
          isLast={currentPage === totalPages - 1}
        />
      )}
    </div>
  );
}
