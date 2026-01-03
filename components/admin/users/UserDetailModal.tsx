"use client";

import { useScrollLock } from "@/hooks";
import { UserDetailResponse } from "@/types";
import { formatFullDateTime } from "@/utils/dateTime";

interface UserDetailModalProps {
  isOpen: boolean;
  user: UserDetailResponse | null;
  onClose: () => void;
}

export const UserDetailModal = ({
  isOpen,
  user,
  onClose,
}: UserDetailModalProps) => {
  useScrollLock(isOpen);

  if (!isOpen || !user) return null;

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return "ADMIN";
      case 2:
        return "SELLER";
      case 3:
        return "BIDDER";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
        <div className="border-b p-6">
          <h3 className="text-xl font-bold">Chi tiết người dùng</h3>
        </div>
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                ID
              </label>
              <p className="mt-1">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Email
              </label>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Họ tên
              </label>
              <p className="mt-1">{user.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Vai trò
              </label>
              <p className="mt-1">{getRoleName(user.roleId)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Ngày sinh
              </label>
              <p className="mt-1">
                {new Date(user.birthDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Trạng thái email
              </label>
              <p className="mt-1">
                {user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Đánh giá tích cực
              </label>
              <p className="mt-1 text-green-600">+{user.positiveRating}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Đánh giá tiêu cực
              </label>
              <p className="mt-1 text-red-600">-{user.negativeRating}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Trạng thái tài khoản
              </label>
              <p
                className={`mt-1 font-semibold ${user.isActive ? "text-green-600" : "text-red-600"}`}
              >
                {user.isActive ? "Hoạt động" : "Bị cấm"}
              </p>
            </div>
            {user.sellerExpiresAt && (
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Seller hết hạn
                </label>
                <p className="mt-1">
                  {formatFullDateTime(user.sellerExpiresAt)}
                </p>
              </div>
            )}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500">
                Địa chỉ
              </label>
              <p className="mt-1">{user.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Ngày tạo
              </label>
              <p className="mt-1">{formatFullDateTime(user.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Cập nhật lần cuối
              </label>
              <p className="mt-1">{formatFullDateTime(user.updatedAt)}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t p-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="cursor-pointer rounded-lg bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
