"use client";

import { ConfirmDialog } from "@/components/ui/common";
import { getMyUpgradeRequestStatus, submitUpgradeRequest } from "@/services";
import { MyUpgradeRequestResponse } from "@/types";
import { formatFullDateTime } from "@/utils/dateTime";
import { useEffect, useState } from "react";
import { FiCheck, FiClock, FiSend, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

export const UpgradeRequestSection = () => {
  const [request, setRequest] = useState<MyUpgradeRequestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const data = await getMyUpgradeRequestStatus();
      setRequest(data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải trạng thái yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    try {
      setSubmitting(true);
      await submitUpgradeRequest({ reason: reason.trim() || undefined });
      toast.success("Gửi yêu cầu nâng cấp thành công");
      setShowForm(false);
      setReason("");
      fetchRequest();
    } catch (error: any) {
      toast.error(error?.message || "Không thể gửi yêu cầu nâng cấp");
    } finally {
      setSubmitting(false);
    }
  };

  const canSendNewRequest = () => {
    if (!request || !request.reviewedAt) return false;
    const reviewedDate = new Date(request.reviewedAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - reviewedDate.getTime()) / (1000 * 60);
    return diffMinutes >= 15;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <FiClock />
            <span className="font-semibold">Đang chờ xét duyệt</span>
          </div>
        );
      case "APPROVED":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <FiCheck />
            <span className="font-semibold">Đã chấp nhận</span>
          </div>
        );
      case "REJECTED":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <FiX />
            <span className="font-semibold">Đã từ chối</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Nâng cấp lên Seller</h2>

      {showForm ? (
        // Show request form
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Lý do muốn trở thành Seller (Tùy chọn)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Ví dụ: Tôi muốn bán đồ cũ không còn sử dụng..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSend />
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setReason("");
              }}
              className="cursor-pointer rounded-lg border px-6 py-2 transition-colors hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : request ? (
        // Show existing request status
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="mb-4">{getStatusBadge(request.status)}</div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Ngày gửi yêu cầu
                </label>
                <p className="mt-1">{formatFullDateTime(request.createdAt)}</p>
              </div>

              {request.reviewedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Ngày xét duyệt
                  </label>
                  <p className="mt-1">
                    {formatFullDateTime(request.reviewedAt)}
                  </p>
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

              {request.reason && (
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-500">
                    Lý do
                  </label>
                  <p className="rounded-lg bg-gray-50 p-3">{request.reason}</p>
                </div>
              )}
            </div>
          </div>

          {request.status === "PENDING" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                Yêu cầu của bạn đang được xem xét. Vui lòng đợi admin phê duyệt.
              </p>
            </div>
          )}

          {request.status === "APPROVED" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-800">
                <strong>Chúc mừng!</strong> Yêu cầu của bạn đã được chấp nhận.
                Bạn có thể bắt đầu đăng sản phẩm ngay bây giờ.
              </p>
            </div>
          )}

          {request.status === "REJECTED" && (
            <div className="space-y-3">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">
                  Yêu cầu của bạn đã bị từ chối.{" "}
                  {canSendNewRequest()
                    ? "Bạn có thể gửi yêu cầu mới."
                    : "Hãy đợi một khoảng thời gian trước khi gửi yêu cầu mới."}
                </p>
              </div>
              {canSendNewRequest() && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
                >
                  <FiSend />
                  Gửi yêu cầu mới
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        // Show upgrade info and button
        <div className="space-y-4">
          <p className="text-gray-600">
            Bạn muốn trở thành người bán và đăng sản phẩm của riêng mình? Gửi
            yêu cầu nâng cấp tài khoản để được admin xét duyệt.
          </p>

          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <h3 className="font-semibold">Lợi ích khi trở thành Seller:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>Đăng bán sản phẩm của riêng bạn</li>
              <li>Quản lý đấu giá và nhận đơn hàng</li>
              <li>Xây dựng uy tín và đánh giá</li>
              <li>Tham gia cộng đồng người bán BidStorm</li>
            </ul>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
          >
            <FiSend />
            Gửi yêu cầu nâng cấp
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Xác nhận gửi yêu cầu"
        message="Bạn có chắc chắn muốn gửi yêu cầu nâng cấp lên Seller?"
        confirmText="Gửi yêu cầu"
        cancelText="Hủy"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
};
