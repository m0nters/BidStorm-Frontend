"use client";

import { logout } from "@/api";
import {
  CategoryManagement,
  ProductManagement,
  StatisticsSection,
  SystemConfigSection,
  UpgradeRequestsManagement,
  UsersManagement,
} from "@/components/admin";
import { RoleGuard } from "@/components/auth";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiBox,
  FiChevronDown,
  FiFolder,
  FiLogOut,
  FiSettings,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";

type TabType = "users" | "statistics" | "config" | "categories" | "products";

const AdminDashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Top-level tabs: users (with sub-tabs), categories, products, statistics, config
  const tabs = [
    { id: "users", label: "Người dùng", icon: FiUsers },
    { id: "categories", label: "Quản lý danh mục", icon: FiFolder },
    { id: "products", label: "Quản lý sản phẩm", icon: FiBox },
    { id: "statistics", label: "Thống kê", icon: FiTrendingUp },
    { id: "config", label: "Cấu hình hệ thống", icon: FiSettings },
  ];

  // Sub-tabs for Người dùng
  type UserSub = "management" | "upgrade-requests";

  const activeTab = (searchParams.get("tab") as TabType) || "users";
  const activeUserSub = (searchParams.get("sub") as UserSub) || "management";

  useEffect(() => {
    if (!searchParams.has("tab")) {
      router.replace(`${pathname}?tab=users&sub=management`);
    }
  }, [searchParams, router, pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Left Sidebar - Dark themed and sticky */}
        <aside className="flex w-64 shrink-0 flex-col bg-gray-900 text-white">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-xl font-bold">BS</span>
            </div>
            <span className="text-lg font-semibold">BidStorm Admin</span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <div className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Menu
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={`/admin?tab=${tab.id}${tab.id === "users" ? `&sub=${activeUserSub}` : ""}`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-gray-800 font-medium text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content area with header */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Header Bar */}
          <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}
              </h1>
            </div>

            {/* Right side - Admin profile */}
            <div className="relative flex items-center gap-4" ref={dropdownRef}>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100"
                >
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <img
                      src={
                        user?.avatarUrl ||
                        "https://bidstorm.s3.ap-southeast-2.amazonaws.com/avatar.png"
                      }
                      alt="Admin avatar"
                      className="h-full w-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "/images/default-avatar.png")
                      }
                    />
                  </div>
                  <FiChevronDown
                    className={`text-gray-400 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="py-1">
                    <Link
                      href="/tai-khoan"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FiUser className="h-4 w-4" />
                      <span>Tài khoản</span>
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FiSettings className="h-4 w-4" />
                      <span>Quay về trang chủ</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={async () => {
                        await logout();
                        clearAuth();
                        setIsUserMenuOpen(false);
                        router.push("/");
                      }}
                      className="flex w-full items-center space-x-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Scrollable content area */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* User sub-tabs (only visible when Người dùng is active) */}
            {activeTab === "users" && (
              <div className="mb-6 rounded-lg bg-white p-4 shadow">
                <div className="flex gap-3">
                  <Link
                    href={`/admin?tab=users&sub=management`}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeUserSub === "management"
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Quản lý người dùng
                  </Link>
                  <Link
                    href={`/admin?tab=users&sub=upgrade-requests`}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeUserSub === "upgrade-requests"
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Yêu cầu nâng cấp
                  </Link>
                </div>
              </div>
            )}

            {/* Content sections */}
            <div className="rounded-lg bg-white p-6 shadow">
              {activeTab === "users" && activeUserSub === "management" && (
                <UsersManagement />
              )}
              {activeTab === "users" &&
                activeUserSub === "upgrade-requests" && (
                  <UpgradeRequestsManagement />
                )}
              {activeTab === "categories" && <CategoryManagement />}
              {activeTab === "products" && <ProductManagement />}
              {activeTab === "statistics" && <StatisticsSection />}
              {activeTab === "config" && <SystemConfigSection />}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default AdminDashboard;
