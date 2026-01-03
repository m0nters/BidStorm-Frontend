"use client";

import {
  CategoryManagement,
  ProductManagement,
  StatisticsSection,
  SystemConfigSection,
  UpgradeRequestsManagement,
  UsersManagement,
} from "@/components/admin";
import { RoleGuard } from "@/components/auth";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  FiBox,
  FiFolder,
  FiSettings,
  FiTrendingUp,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

type TabType =
  | "users"
  | "upgrade-requests"
  | "statistics"
  | "config"
  | "categories"
  | "products";

const AdminDashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = (searchParams.get("tab") as TabType) || "users";

  const tabs = [
    { id: "users", label: "Quản lý người dùng", icon: FiUsers },
    {
      id: "upgrade-requests",
      label: "Yêu cầu nâng cấp",
      icon: FiUserPlus,
    },
    {
      id: "categories",
      label: "Quản lý danh mục",
      icon: FiFolder,
    },
    {
      id: "products",
      label: "Quản lý sản phẩm",
      icon: FiBox,
    },
    {
      id: "statistics",
      label: "Thống kê",
      icon: FiTrendingUp,
    },
    { id: "config", label: "Cấu hình hệ thống", icon: FiSettings },
  ];

  // Auto-redirect to ?tab=users if no tab is specified
  useEffect(() => {
    if (!searchParams.has("tab")) {
      router.replace(`${pathname}?tab=users`);
    }
  }, [searchParams, router, pathname]);

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-black py-6 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Bảng điều khiển Admin</h1>
            <p className="mt-2 text-gray-300">
              Quản lý hệ thống đấu giá BidStorm
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-white">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    href={`/admin?tab=${tab.id}`}
                    className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-4 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-black font-semibold text-black"
                        : "border-transparent text-gray-600 hover:text-black"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === "users" && <UsersManagement />}
          {activeTab === "upgrade-requests" && <UpgradeRequestsManagement />}
          {activeTab === "categories" && <CategoryManagement />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "statistics" && <StatisticsSection />}
          {activeTab === "config" && <SystemConfigSection />}
        </div>
      </div>
    </RoleGuard>
  );
};

export default AdminDashboard;
