import { CommentResponse } from "@/types";
import { FiMessageCircle, FiTrash2 } from "react-icons/fi";

interface CommentItemProps {
  comment: CommentResponse;
  onReply: (parentId: number, parentUserName: string) => void;
  onDelete: (commentId: number) => void;
  currentUserId?: number;
  level?: number;
}

export const CommentItem = ({
  comment,
  onReply,
  onDelete,
  currentUserId,
  level = 0,
}: CommentItemProps) => {
  const canDelete = currentUserId === comment.userId;
  const isReply = !comment.isQuestion;

  return (
    <div
      className={`${level > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div>
              <p className="font-semibold text-gray-900">{comment.userName}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
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

        <button
          onClick={() => onReply(comment.id, comment.userName)}
          className="mt-2 flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-black"
        >
          <FiMessageCircle className="h-3.5 w-3.5" />
          Trả lời
        </button>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};
