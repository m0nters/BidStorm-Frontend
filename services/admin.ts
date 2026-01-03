import { api } from "@/api/fetch";
import {
  AdminStatisticsOverviewResponse,
  ChangeUserRoleRequest,
  PaginatedResponse,
  RoleResponse,
  SystemConfigResponse,
  UpdateSystemConfigRequest,
  UpgradeRequestResponse,
  UserDetailResponse,
  UserListResponse,
} from "@/types";

// User Management APIs
export const listUsers = async (params?: {
  page?: number;
  size?: number;
  roleId?: number;
  isActive?: boolean;
  sortDirection?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params?.size !== undefined)
    queryParams.append("size", params.size.toString());
  if (params?.roleId !== undefined)
    queryParams.append("roleId", params.roleId.toString());
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());
  if (params?.sortDirection !== undefined)
    queryParams.append("sortDirection", params.sortDirection);

  const response = await api.get<PaginatedResponse<UserListResponse>>(
    `/admin/users?${queryParams.toString()}`,
    { auth: true },
  );
  return response.data;
};

export const getUserDetails = async (id: number) => {
  const response = await api.get<UserDetailResponse>(`/admin/users/${id}`, {
    auth: true,
  });
  return response.data;
};

export const banUser = async (id: number) => {
  const response = await api.patch<void>(`/admin/users/${id}/ban`, null, {
    auth: true,
  });
  return response.data;
};

export const unbanUser = async (id: number) => {
  const response = await api.patch<void>(`/admin/users/${id}/unban`, null, {
    auth: true,
  });
  return response.data;
};

// Upgrade Request Management APIs
export const listUpgradeRequests = async () => {
  const response = await api.get<UpgradeRequestResponse[]>(
    "/admin/upgrade-requests",
    { auth: true },
  );
  return response.data;
};

export const listPendingUpgradeRequests = async () => {
  const response = await api.get<UpgradeRequestResponse[]>(
    "/admin/upgrade-requests/pending",
    { auth: true },
  );
  return response.data;
};

export const approveUpgradeRequest = async (id: number) => {
  const response = await api.patch<void>(
    `/admin/upgrade-requests/${id}/approve`,
    null,
    { auth: true },
  );
  return response.data;
};

export const rejectUpgradeRequest = async (id: number) => {
  const response = await api.patch<void>(
    `/admin/upgrade-requests/${id}/reject`,
    null,
    { auth: true },
  );
  return response.data;
};

// Statistics APIs

export const getStatisticsOverview = async (params?: {
  timePeriod?: string;
  leaderboardLimit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.timePeriod) queryParams.append("timePeriod", params.timePeriod);
  if (params?.leaderboardLimit)
    queryParams.append("leaderboardLimit", params.leaderboardLimit.toString());

  const query = queryParams.toString();
  const response = await api.get<AdminStatisticsOverviewResponse>(
    `/admin/statistics/overview${query ? `?${query}` : ""}`,
    { auth: true },
  );
  return response.data;
};

// System Configuration APIs
export const listSystemConfigs = async () => {
  const response = await api.get<SystemConfigResponse[]>("/admin/configs", {
    auth: true,
  });
  return response.data;
};

export const getSystemConfig = async (key: string) => {
  const response = await api.get<SystemConfigResponse>(
    `/admin/configs/${key}`,
    {
      auth: true,
    },
  );
  return response.data;
};

export const updateSystemConfig = async (
  key: string,
  data: UpdateSystemConfigRequest,
) => {
  const response = await api.put<SystemConfigResponse>(
    `/admin/configs/${key}`,
    data,
    { auth: true },
  );
  return response.data;
};

// Role Management APIs
export const getAllRoles = async (): Promise<RoleResponse[]> => {
  const response = await api.get<RoleResponse[]>("/roles");
  return response.data;
};

export const changeUserRole = async (
  userId: number,
  request: ChangeUserRoleRequest,
): Promise<void> => {
  await api.patch(`/admin/users/${userId}/role`, request, { auth: true });
};

// Category Management APIs
export const createCategory = async (request: {
  name: string;
  parentId: number | null;
}) => {
  const response = await api.post("/categories", request, { auth: true });
  return response.data;
};

export const updateCategory = async (
  id: number,
  request: { name: string; parentId: number | null },
) => {
  const response = await api.put(`/categories/${id}`, request, { auth: true });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`, { auth: true });
};

// Product Management APIs
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`, { auth: true });
};
