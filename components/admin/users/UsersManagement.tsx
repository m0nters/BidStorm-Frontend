"use client";

import { ConfirmDialog, Pagination } from "@/components/ui/common";
import { DropdownMenu } from "@/components/ui/common/DropdownMenu";
import {
  banUser,
  changeUserRole,
  deleteUser,
  getAllRoles,
  getUserDetails,
  listUsers,
  unbanUser,
} from "@/services";
import { RoleResponse, UserDetailResponse, UserListResponse } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaBan } from "react-icons/fa6";
import { FiEye, FiTrash2, FiUnlock } from "react-icons/fi";
import { toast } from "react-toastify";
import { UserDetailModal } from "./UserDetailModal";

export const UsersManagement = () => {
  const [users, setUsers] = useState<UserListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [showUnbanConfirm, setShowUnbanConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [showRoleChangeConfirm, setShowRoleChangeConfirm] = useState(false);
  const [newRoleId, setNewRoleId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await listUsers({
        page: currentPage,
        size: 20,
        roleId: roleFilter,
        isActive: activeFilter,
        sortDirection: sortDirection,
      });
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải danh sách vai trò");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, activeFilter, sortDirection]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleBanUser = (userId: number) => {
    setActionUserId(userId);
    setShowBanConfirm(true);
  };

  const confirmBanUser = async () => {
    if (!actionUserId) return;
    setShowBanConfirm(false);
    try {
      await banUser(actionUserId);
      toast.success("Đã cấm người dùng thành công");
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cấm người dùng");
    } finally {
      setActionUserId(null);
    }
  };

  const handleUnbanUser = (userId: number) => {
    setActionUserId(userId);
    setShowUnbanConfirm(true);
  };

  const confirmUnbanUser = async () => {
    if (!actionUserId) return;
    setShowUnbanConfirm(false);
    try {
      await unbanUser(actionUserId);
      toast.success("Đã bỏ cấm người dùng thành công");
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.message || "Không thể bỏ cấm người dùng");
    } finally {
      setActionUserId(null);
    }
  };

  const handleViewDetails = async (userId: number) => {
    try {
      const details = await getUserDetails(userId);
      setSelectedUser(details);
      setShowDetailModal(true);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải thông tin người dùng");
    }
  };

  const handleRoleChange = (userId: number, roleId: string) => {
    setActionUserId(userId);
    setNewRoleId(Number(roleId));
    setShowRoleChangeConfirm(true);
  };

  const confirmRoleChange = async () => {
    if (!actionUserId || !newRoleId) return;
    setShowRoleChangeConfirm(false);
    try {
      await changeUserRole(actionUserId, { roleId: newRoleId });
      toast.success("Đã thay đổi vai trò người dùng thành công");
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.message || "Không thể thay đổi vai trò người dùng");
    } finally {
      setActionUserId(null);
      setNewRoleId(null);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setActionUserId(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!actionUserId) return;
    setShowDeleteConfirm(false);
    try {
      await deleteUser(actionUserId);
      toast.success("Đã xóa người dùng thành công");
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa người dùng");
    } finally {
      setActionUserId(null);
    }
  };

  const getRatingPercentage = (positive: number, negative: number) => {
    const total = positive + negative;
    if (total === 0) return "N/A";
    return `${Math.round((positive / total) * 100)}%`;
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Quản lý người dùng</h2>

      {/* Filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Vai trò</label>
            <DropdownMenu
              value={roleFilter?.toString() || ""}
              options={[
                { value: "", label: "Tất cả" },
                ...roles.map((role) => ({
                  value: role.id.toString(),
                  label: role.name,
                })),
              ]}
              isSorted={false}
              onChange={(value) =>
                setRoleFilter(value ? Number(value) : undefined)
              }
              className="w-48"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Trạng thái</label>
            <DropdownMenu
              value={
                activeFilter === undefined
                  ? ""
                  : activeFilter
                    ? "true"
                    : "false"
              }
              options={[
                { value: "", label: "Tất cả" },
                { value: "true", label: "Đang hoạt động" },
                { value: "false", label: "Bị cấm" },
              ]}
              isSorted={false}
              onChange={(value) =>
                setActiveFilter(value === "" ? undefined : value === "true")
              }
              className="w-48"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Sắp xếp</label>
            <DropdownMenu
              value={sortDirection}
              options={[
                { value: "desc", label: "Mới nhất" },
                { value: "asc", label: "Cũ nhất" },
              ]}
              isSorted={false}
              onChange={(value) => setSortDirection(value as "asc" | "desc")}
              className="w-48"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white py-12 text-center">
          <Image
            src="/user-not-found.png"
            alt="Không tìm thấy danh mục"
            width={300}
            height={1000} // Height will adjust automatically to maintain aspect ratio
            priority
          />
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Không tìm thấy người dùng
            </h1>
            <p className="mx-auto max-w-md text-lg text-gray-600">
              Rất tiếc, hệ thống không tìm thấy người dùng nào phù hợp với bộ
              lọc của bạn. Vui lòng thử lại với các tiêu chí khác.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-visible rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="h-full w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="-translate-x-2 px-6 py-4 text-center text-sm whitespace-nowrap">
                      {index + 1 + currentPage * 20}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <DropdownMenu
                        value={user.roleId.toString()}
                        options={roles.map((role) => ({
                          value: role.id.toString(),
                          label: role.name,
                        }))}
                        isSorted={false}
                        onChange={(value) => handleRoleChange(user.id, value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">
                          +{user.positiveRating}
                        </span>
                        <span className="text-red-600">
                          -{user.negativeRating}
                        </span>
                        <span className="text-gray-500">
                          (
                          {getRatingPercentage(
                            user.positiveRating,
                            user.negativeRating,
                          )}
                          )
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Bị cấm"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100"
                          title="Xem chi tiết"
                        >
                          <FiEye className="text-blue-600" />
                        </button>
                        {user.isActive ? (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-red-50"
                            title="Cấm người dùng"
                          >
                            <FaBan className="text-red-600" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-green-50"
                            title="Bỏ cấm"
                          >
                            <FiUnlock className="text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-red-50"
                          title="Xóa người dùng"
                        >
                          <FiTrash2 className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page - 1)}
            isFirst={currentPage === 0}
            isLast={currentPage === totalPages - 1}
          />
        </div>
      )}

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={showDetailModal}
        user={selectedUser}
        onClose={() => setShowDetailModal(false)}
      />

      <ConfirmDialog
        isOpen={showBanConfirm}
        title="Xác nhận cấm người dùng"
        message="Bạn có chắc chắn muốn cấm người dùng này? Người dùng sẽ không thể đăng nhập vào hệ thống."
        confirmText="Cấm người dùng"
        cancelText="Hủy"
        onConfirm={confirmBanUser}
        onCancel={() => {
          setShowBanConfirm(false);
          setActionUserId(null);
        }}
      />

      <ConfirmDialog
        isOpen={showUnbanConfirm}
        title="Xác nhận bỏ cấm"
        message="Bạn có chắc chắn muốn bỏ cấm người dùng này? Người dùng sẽ có thể đăng nhập lại vào hệ thống."
        confirmText="Bỏ cấm"
        cancelText="Hủy"
        onConfirm={confirmUnbanUser}
        onCancel={() => {
          setShowUnbanConfirm(false);
          setActionUserId(null);
        }}
      />

      <ConfirmDialog
        isOpen={showRoleChangeConfirm}
        title="Xác nhận thay đổi vai trò"
        message={`Bạn có chắc chắn muốn thay đổi vai trò người dùng này thành ${roles.find((r) => r.id === newRoleId)?.name}?`}
        confirmText="Thay đổi vai trò"
        cancelText="Hủy"
        onConfirm={confirmRoleChange}
        onCancel={() => {
          setShowRoleChangeConfirm(false);
          setActionUserId(null);
          setNewRoleId(null);
        }}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        confirmText="Xóa người dùng"
        cancelText="Hủy"
        onConfirm={confirmDeleteUser}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setActionUserId(null);
        }}
      />
    </div>
  );
};
