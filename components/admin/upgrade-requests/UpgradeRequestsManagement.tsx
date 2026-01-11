"use client";

import { ConfirmDialog } from "@/components/ui/common";
import {
  approveUpgradeRequest,
  listPendingUpgradeRequests,
  listUpgradeRequests,
  rejectUpgradeRequest,
} from "@/services";
import { UpgradeRequestResponse } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UpgradeRequestCard } from "./UpgradeRequestCard";

export const UpgradeRequestsManagement = () => {
  const [requests, setRequests] = useState<UpgradeRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending">("pending");
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [actionRequestId, setActionRequestId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data =
        filter === "pending"
          ? await listPendingUpgradeRequests()
          : await listUpgradeRequests();
      setRequests(data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleApprove = (id: number) => {
    setActionRequestId(id);
    setShowApproveConfirm(true);
  };

  const confirmApprove = async () => {
    if (!actionRequestId) return;
    setShowApproveConfirm(false);
    try {
      await approveUpgradeRequest(actionRequestId);
      toast.success("Đã chấp nhận yêu cầu nâng cấp");
      fetchRequests();
    } catch (error: any) {
      toast.error(error?.message || "Không thể chấp nhận yêu cầu");
    } finally {
      setActionRequestId(null);
    }
  };

  const handleReject = (id: number) => {
    setActionRequestId(id);
    setShowRejectConfirm(true);
  };

  const confirmReject = async () => {
    if (!actionRequestId) return;
    setShowRejectConfirm(false);
    try {
      await rejectUpgradeRequest(actionRequestId);
      toast.success("Đã từ chối yêu cầu nâng cấp");
      fetchRequests();
    } catch (error: any) {
      toast.error(error?.message || "Không thể từ chối yêu cầu");
    } finally {
      setActionRequestId(null);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Quản lý yêu cầu nâng cấp</h2>

      {/* Filter */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("pending")}
            className={`cursor-pointer rounded-lg px-4 py-2 transition-colors ${
              filter === "pending"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Đang chờ
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`cursor-pointer rounded-lg px-4 py-2 transition-colors ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Đã xử lý
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center">
          <p className="text-gray-500">Không có yêu cầu nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <UpgradeRequestCard
              key={request.id}
              request={request}
              onApprove={() => handleApprove(request.id)}
              onReject={() => handleReject(request.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showApproveConfirm}
        title="Xác nhận chấp nhận"
        message="Bạn có chắc chắn muốn chấp nhận yêu cầu này? Người dùng sẽ được nâng cấp lên vai trò Seller."
        confirmText="Chấp nhận"
        cancelText="Hủy"
        onConfirm={confirmApprove}
        onCancel={() => {
          setShowApproveConfirm(false);
          setActionRequestId(null);
        }}
      />

      <ConfirmDialog
        isOpen={showRejectConfirm}
        title="Xác nhận từ chối"
        message="Bạn có chắc chắn muốn từ chối yêu cầu này? Người dùng sẽ phải gửi yêu cầu mới nếu muốn trở thành Seller."
        confirmText="Từ chối"
        cancelText="Hủy"
        onConfirm={confirmReject}
        onCancel={() => {
          setShowRejectConfirm(false);
          setActionRequestId(null);
        }}
      />
    </div>
  );
};
