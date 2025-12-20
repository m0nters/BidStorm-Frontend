"use client";

import { ConfirmDialog } from "@/components/ui";
import { useProductComments } from "@/hooks";
import { createComment, deleteComment } from "@/services";
import { useAuthStore } from "@/store/authStore";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { CommentItem } from "../comment/CommentItem";

// Register GSAP plugin
gsap.registerPlugin(ScrollToPlugin);

interface QASectionProps {
  productId: number;
  isEnded: boolean;
  isSeller: boolean;
}

export const QASection = ({ productId, isEnded, isSeller }: QASectionProps) => {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { comments, loading, addCommentOptimistically } = useProductComments(
    productId,
    { isSeller },
  );
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    id: number;
    userName: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState<
    number | null
  >(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle scroll to comment from query param
  useEffect(() => {
    const commentId = searchParams.get("comment_id");
    if (!commentId || comments.length === 0) return;

    const scrollToElement = () => {
      const id = parseInt(commentId);
      setHighlightedCommentId(id);

      const element = document.getElementById(`comment-${id}`);
      if (element) {
        // Get element position
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle =
          absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

        // Use GSAP for smooth scroll with exact duration control
        gsap.to(window, {
          duration: 0.8,
          scrollTo: { y: middle, autoKill: true },
          ease: "power2.out",
          onComplete: () => {
            setTimeout(() => {
              setHighlightedCommentId(null);
            }, 1000);
          },
        });
      }
    };

    // Wait for browser to finish rendering
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToElement);
    });
  }, [searchParams, comments]);

  // Handle scroll to comment form after redirect from login
  useEffect(() => {
    if (loading) return;

    // Get the hash of the url
    const scrollTarget = window.location.hash.substring(1);

    if (scrollTarget) {
      // Use requestAnimationFrame to wait for next paint cycle when DOM is ready
      const scrollToElement = () => {
        const element = document.getElementById(scrollTarget);

        if (element) {
          // Get element position
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle =
            absoluteElementTop -
            window.innerHeight / 2 +
            elementRect.height / 2;

          // Use GSAP for smooth scroll with exact duration control
          gsap.to(window, {
            duration: 0.8,
            scrollTo: { y: middle, autoKill: true },
            ease: "power2.out",
            onComplete: () => {
              // Focus textarea after scroll completes (only for comment-form)
              if (scrollTarget === "comment-form" && user) {
                textareaRef.current?.focus();
              }
            },
          });
        }
      };

      // Wait for browser to finish rendering
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToElement);
      });
    }
  }, [loading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    if (!user) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    try {
      setSubmitting(true);
      const createdComment = await createComment({
        productId,
        parentId: replyingTo?.id,
        content: newComment.trim(),
      });

      // Add comment immediately with personalized response (unmasked name, isYourself flag)
      // This ensures commenter sees their own unmasked name
      // WebSocket duplicate check will ignore the masked broadcast
      addCommentOptimistically(createdComment);

      setNewComment("");
      setReplyingTo(null);

      // Scroll to and highlight the new comment
      setHighlightedCommentId(createdComment.id);
      setTimeout(() => {
        const element = document.getElementById(`comment-${createdComment.id}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (error: any) {
      console.error("Error creating comment:", error);
      const errorMessage = error.message || "Không thể gửi bình luận";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setDeleteConfirm(null);
      // WebSocket will handle removing the comment automatically
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Không thể xóa bình luận");
    }
  };

  const handleReply = (parentId: number, userName: string) => {
    setReplyingTo({ id: parentId, userName });
    // Scroll to the comment form and focus textarea
    const form = document.getElementById("comment-form");
    form?.scrollIntoView({ behavior: "smooth", block: "center" });

    // Focus textarea after scroll animation
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 500);
  };

  if (loading) {
    return (
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Hỏi đáp</h2>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Hỏi đáp</h2>

      {/* Comment List */}
      {comments.length > 0 ? (
        <div className="mb-6 space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={(id) => setDeleteConfirm(id)}
              currentUserId={user?.id}
              highlightedCommentId={highlightedCommentId}
              isSeller={isSeller}
            />
          ))}
        </div>
      ) : (
        <div className="mb-6 flex flex-col items-center justify-center gap-1 py-8">
          <Image
            src="/no-questions.png"
            alt="Không tìm thấy câu hỏi"
            width={164}
            height={164}
          />
          <p className="text-gray-500">Chưa có câu hỏi nào</p>
          <p className="font-semibold">
            Hãy là người đầu tiên đặt câu hỏi về sản phẩm này!
          </p>
        </div>
      )}

      {/* Comment Form */}
      {!isEnded && user && (
        <form id="comment-form" onSubmit={handleSubmit} className="space-y-4">
          {replyingTo && (
            <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
              <p className="text-sm text-gray-700">
                Đang trả lời{" "}
                <span className="font-semibold">{replyingTo.userName}</span>
              </p>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="cursor-pointer text-sm font-medium text-gray-600 hover:text-black"
              >
                Hủy
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              replyingTo
                ? "Nhập câu trả lời của bạn..."
                : "Đặt câu hỏi về sản phẩm..."
            }
            className="w-full resize-none rounded-lg border border-gray-300 p-4 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            rows={4}
            disabled={submitting}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="cursor-pointer rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting
                ? "Đang gửi..."
                : replyingTo
                  ? "Gửi trả lời"
                  : "Gửi câu hỏi"}
            </button>
          </div>
        </form>
      )}

      {!isEnded && !user && (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <p className="mb-3 text-gray-700">
            Vui lòng đăng nhập để đặt câu hỏi
          </p>
          <Link
            href={`/dang-nhap?redirectTo=${encodeURIComponent(pathname + "#comment-form")}`}
            className="inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800"
          >
            Đăng nhập
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm !== null && (
        <ConfirmDialog
          isOpen={deleteConfirm !== null}
          title="Xóa bình luận"
          message="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};
