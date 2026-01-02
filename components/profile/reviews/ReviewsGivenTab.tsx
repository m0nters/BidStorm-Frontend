"use client";

import {
  deleteReview,
  getGivenReviews,
  updateReview,
} from "@/services/reviews";
import { ReviewResponse } from "@/types";
import { UpdateReviewFormData, updateReviewSchema } from "@/validations/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ConfirmDialog, Pagination } from "../../ui/common";
import { ReviewCard } from "./ReviewCard";

export function ReviewsGivenTab() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [deletingReviewId, setDeleteingReviewId] = useState<number | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateReviewFormData>({
    resolver: zodResolver(updateReviewSchema),
  });

  const fetchReviews = async (page = 0) => {
    try {
      setLoading(true);
      const data = await getGivenReviews(page, 10);
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

  const handleEdit = (review: ReviewResponse) => {
    setEditingReviewId(review.id);
    setValue("rating", review.rating);
    setValue("comment", review.comment || "");
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    reset();
  };

  const handleUpdate = async (data: UpdateReviewFormData) => {
    if (!editingReviewId) return;

    const review = reviews.find((r) => r.id === editingReviewId);
    if (!review) return;

    try {
      setIsSubmitting(true);
      await updateReview(review.productId, data);
      toast.success("Cập nhật đánh giá thành công!");
      setEditingReviewId(null);
      reset();
      await fetchReviews(currentPage);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể cập nhật đánh giá";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingReviewId) return;

    const review = reviews.find((r) => r.id === deletingReviewId);
    if (!review) return;

    try {
      await deleteReview(review.productId);
      toast.success("Xóa đánh giá thành công!");
      setDeleteingReviewId(null);
      await fetchReviews(currentPage);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể xóa đánh giá";
      toast.error(errorMessage);
    }
  };

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
        <p className="text-gray-600">Bạn chưa đánh giá ai.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isEditing = editingReviewId === review.id;

          return (
            <ReviewCard
              key={review.id}
              review={review}
              isEditing={isEditing}
              canEdit={true}
              isSubmitting={isSubmitting}
              tabType="given"
              register={register}
              errors={errors}
              setValue={setValue}
              onEdit={handleEdit}
              onDelete={setDeleteingReviewId}
              onUpdate={handleSubmit(handleUpdate)}
              onCancelEdit={handleCancelEdit}
            />
          );
        })}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingReviewId !== null}
        onCancel={() => setDeleteingReviewId(null)}
        onConfirm={handleDelete}
        title="Xác nhận xóa đánh giá"
        message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
