"use client";

import { useScrollLock } from "@/hooks";
import { getUserReviewsByUserId } from "@/services/reviews";
import { ReviewResponse } from "@/types";
import { formatFullDateTime } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiThumbsDown, FiThumbsUp, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { Pagination } from "./Pagination";

interface UserReviewsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export const UserReviewsDialog = ({
  isOpen,
  onClose,
  userId,
  userName,
}: UserReviewsDialogProps) => {
  useScrollLock(isOpen);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchReviews(0);
    } else {
      // Reset state when dialog closes
      setReviews([]);
      setCurrentPage(0);
      setTotalPages(0);
    }
  }, [isOpen, userId]);

  const fetchReviews = async (page: number) => {
    try {
      setLoading(true);
      const data = await getUserReviewsByUserId(userId, page, 10);
      setReviews(data.content);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
      setIsFirst(data.first);
      setIsLast(data.last);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể tải danh sách đánh giá";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchReviews(page - 1);
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
      <div className="relative w-full max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Đánh giá của {userName}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Đóng"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Image
                src="/no-reviews.png"
                alt="Chưa có đánh giá"
                width={150}
                height={200}
              />
              <p className="mt-4 text-gray-600">
                Người dùng này chưa có đánh giá nào
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="flex gap-4 p-4">
                    {/* Product Thumbnail - Clickable */}
                    <Link href={`/san-pham/${review.productUrl}`}>
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
                      <div>
                        {/* Product Title - Clickable */}
                        <Link
                          href={`/san-pham/${review.productUrl}`}
                          className="mb-1 block font-semibold text-gray-900 hover:text-black hover:underline"
                        >
                          {review.productTitle}
                        </Link>
                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                          <span>Người đánh giá: {review.reviewerName}</span>
                          <span>{formatFullDateTime(review.createdAt)}</span>
                        </div>
                      </div>

                      {/* Rating Badge */}
                      <div>
                        {review.rating === 1 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                            <FiThumbsUp className="h-4 w-4" />
                            Tích cực
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700">
                            <FiThumbsDown className="h-4 w-4" />
                            Tiêu cực
                          </span>
                        )}
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-sm whitespace-pre-wrap text-gray-700">
                            {review.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && reviews.length > 0 && totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <Pagination
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isFirst={isFirst}
              isLast={isLast}
            />
          </div>
        )}
      </div>
    </div>
  );
};
