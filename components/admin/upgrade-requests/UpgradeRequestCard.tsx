"use client";

import { UpgradeRequestResponse } from "@/types";
import { formatFullDateTime } from "@/utils/dateTime";
import { FiCheck, FiX } from "react-icons/fi";

interface Props {
  request: UpgradeRequestResponse;
  onApprove: () => void;
  onReject: () => void;
}

export const UpgradeRequestCard = ({ request, onApprove, onReject }: Props) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
            Đang chờ
          </span>
        );
      case "APPROVED":
        return (
          <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            Đã chấp nhận
          </span>
        );
      case "REJECTED":
        return (
          <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            Đã từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getRatingPercentage = (positive: number, negative: number) => {
    const total = positive + negative;
    if (total === 0) return "N/A";
    return `${Math.round((positive / total) * 100)}%`;
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">{request.bidderName}</h3>
          <p className="text-sm text-gray-600">{request.bidderEmail}</p>
        </div>
        {getStatusBadge(request.status)}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-500">
            ID người dùng
          </label>
          <p className="mt-1">{request.bidderId}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Đánh giá
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-green-600">
              +{request.bidderPositiveRating}
            </span>
            <span className="text-red-600">
              -{request.bidderNegativeRating}
            </span>
            <span className="text-gray-500">
              (
              {getRatingPercentage(
                request.bidderPositiveRating,
                request.bidderNegativeRating,
              )}
              )
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Ngày gửi
          </label>
          <p className="mt-1">{formatFullDateTime(request.createdAt)}</p>
        </div>
        {request.reviewedAt && (
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Ngày xét duyệt
            </label>
            <p className="mt-1">{formatFullDateTime(request.reviewedAt)}</p>
          </div>
        )}
        {request.adminName && (
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Admin xét duyệt
            </label>
            <p className="mt-1">{request.adminName}</p>
          </div>
        )}
      </div>

      {request.reason && (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-500">
            Lý do
          </label>
          <p className="rounded-lg bg-gray-50 p-3">{request.reason}</p>
        </div>
      )}

      {request.status === "PENDING" && (
        <div className="flex gap-3 border-t pt-4">
          <button
            onClick={onApprove}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            <FiCheck />
            Chấp nhận
          </button>
          <button
            onClick={onReject}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            <FiX />
            Từ chối
          </button>
        </div>
      )}
    </div>
  );
};
