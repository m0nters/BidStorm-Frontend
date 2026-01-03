"use client";

import { useScrollLock } from "@/hooks";
import { UserDetailResponse } from "@/types";
import { formatFullDateTime } from "@/utils/dateTime";
import Image from "next/image";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

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
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
        {/* Header with Avatar */}
        <div className="border-b bg-linear-to-br from-gray-50 to-white p-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <Image
                src={user.avatarUrl}
                alt={user.fullName}
                width={100}
                height={100}
                className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {user.fullName}
              </h3>
              <p className="mt-1 text-gray-600">{user.email}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    user.roleId === 1
                      ? "bg-purple-100 text-purple-800"
                      : user.roleId === 2
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {getRoleName(user.roleId)}
                </span>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    user.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isActive ? "Hoạt động" : "Bị cấm"}
                </span>
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    <FiCheckCircle className="h-3 w-3" />
                    Email đã xác thực
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                    <FiXCircle className="h-3 w-3" />
                    Email chưa xác thực
                  </span>
                )}
              </div>
            </div>

            {/* Rating Stats */}
            <div className="shrink-0 rounded-lg bg-white p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {user.positiveRating + user.negativeRating > 0
                    ? Math.round(
                        (user.positiveRating /
                          (user.positiveRating + user.negativeRating)) *
                          100,
                      )
                    : 0}
                  %
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <FiCheckCircle className="h-4 w-4" />
                    {user.positiveRating}
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <FiXCircle className="h-4 w-4" />
                    {user.negativeRating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-6 p-8">
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-900">
              Thông tin chi tiết
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  ID
                </label>
                <p className="mt-1 font-medium text-gray-900">{user.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Ngày sinh
                </label>
                <p className="mt-1 font-medium text-gray-900">
                  {user.birthDate
                    ? new Date(user.birthDate).toLocaleDateString("vi-VN")
                    : "(Trống)"}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500">
                  Địa chỉ
                </label>
                <p className="mt-1 font-medium text-gray-900">{user.address}</p>
              </div>
              {user.sellerExpiresAt && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500">
                    Seller hết hạn
                  </label>
                  <p className="mt-1 font-medium text-gray-900">
                    {formatFullDateTime(user.sellerExpiresAt)}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Ngày tạo
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatFullDateTime(user.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Cập nhật lần cuối
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatFullDateTime(user.updatedAt)}
                </p>
              </div>
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
