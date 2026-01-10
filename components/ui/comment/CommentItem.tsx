"use client";

import { UserReviewsDialog } from "@/components/ui/common";
import { CommentResponse } from "@/types";
import { formatFullDateTime, formatRelativeTime } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiClock, FiMessageCircle, FiTrash2 } from "react-icons/fi";

interface CommentItemProps {
  comment: CommentResponse;
  onReply: (parentId: number, parentUserName: string) => void;
  onDelete: (commentId: number) => void;
  currentUserId?: number;
  level?: number;
  highlightedCommentId?: number | null;
  isSeller?: boolean;
  productSellerId?: number;
}

export const CommentItem = ({
  comment,
  onReply,
  onDelete,
  currentUserId,
  level = 0,
  highlightedCommentId,
  isSeller = false,
  productSellerId,
}: CommentItemProps) => {
  const canDelete = currentUserId === comment.userId;
  const pathname = usePathname();
  const isHighlighted = highlightedCommentId === comment.id;
  const [showReviewsDialog, setShowReviewsDialog] = useState(false);

  // Determine if we can view reviews:
  // - Anyone can view seller reviews
  // - Only seller can view bidder reviews
  const isCommentAuthorSeller = comment.userId === productSellerId;
  const canViewReviews = isCommentAuthorSeller || isSeller;

  const handleViewReviews = () => {
    setShowReviewsDialog(true);
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className={`${level > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <div
        className={`rounded-lg p-4 transition-colors duration-500 ${
          isHighlighted ? "bg-blue-100" : "bg-gray-50"
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">
                    {comment.userName}
                    {comment.isYourself ? ` (Bạn)` : ""}
                  </p>
                  {comment.isProductSeller && (
                    <span className="rounded bg-black px-2 py-0.5 text-xs font-medium text-white">
                      Người bán
                    </span>
                  )}
                </div>
                {(comment.isYourself || canViewReviews) && (
                  <button
                    onClick={handleViewReviews}
                    className="cursor-pointer text-left text-xs text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                  >
                    Xem chi tiết đánh giá{comment.isYourself ? " của bạn" : ""}
                  </button>
                )}
              </div>
              <Link
                href={`${pathname}?comment_id=${comment.id}`}
                className="flex cursor-pointer items-center gap-1 hover:underline hover:underline-offset-2"
              >
                <FiClock className="h-3.5 w-3.5 text-gray-400" />
                <p
                  className="text-xs text-gray-500"
                  title={formatFullDateTime(comment.createdAt)}
                >
                  {formatRelativeTime(comment.createdAt)}
                </p>
              </Link>
            </div>
          </div>
          {canDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="cursor-pointer text-gray-400 transition-colors hover:text-red-600"
              title="Xóa bình luận"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="whitespace-pre-wrap text-gray-900">{comment.content}</p>

        {isSeller && (
          <button
            onClick={() => onReply(comment.id, comment.userName)}
            className="mt-2 flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-black"
          >
            <FiMessageCircle className="h-3.5 w-3.5" />
            Trả lời
          </button>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              currentUserId={currentUserId}
              level={level + 1}
              highlightedCommentId={highlightedCommentId}
              isSeller={isSeller}
              productSellerId={productSellerId}
            />
          ))}
        </div>
      )}

      {/* User Reviews Dialog */}
      <UserReviewsDialog
        isOpen={showReviewsDialog}
        onClose={() => setShowReviewsDialog(false)}
        userId={comment.userId}
        userName={comment.userName}
      />
    </div>
  );
};
