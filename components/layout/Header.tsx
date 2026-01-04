"use client";

import { logout } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { CategoryResponse } from "@/types/category";
import { hasRolePermission } from "@/utils/roleHierarchy";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiLogOut,
  FiMenu,
  FiSearch,
  FiTrendingUp,
  FiUser,
  FiX,
} from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiAdminLine } from "react-icons/ri";

interface HeaderProps {
  categories: CategoryResponse[];
}

export function Header({ categories }: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
    setIsMobileMenuOpen(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "SELLER":
        return "Người bán";
      case "BIDDER":
        return "Người mua";
      default:
        return "Người dùng";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* Main Header */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Image
                src="/logo.png"
                alt="BidStorm Logo"
                width={40}
                height={40}
              />
              <div className="select-none">
                <span className="text-black">Bid</span>
                <span className="text-gray-400">Storm</span>
              </div>
            </div>
          </a>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="mx-8 hidden max-w-2xl flex-1 md:flex"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-gray-400 transition-colors hover:text-black"
              >
                <FiSearch className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Right Side - Desktop */}
          {isInitializing ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
              Đang tải thông tin
            </div>
          ) : isAuthenticated ? (
            <div
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <Link
                href="/tai-khoan"
                className="flex items-center space-x-2 rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
              >
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.fullName}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    {user?.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="hidden font-medium md:inline-block">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getRoleLabel(user!.role)}
                  </p>
                </div>
              </Link>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 z-50 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    {user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-purple-700 transition-colors hover:bg-purple-50"
                      >
                        <RiAdminLine className="h-4 w-4" />
                        <span>Bảng điều khiển Admin</span>
                      </Link>
                    )}
                    <Link
                      href="/tai-khoan"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FiUser className="h-4 w-4" />
                      <span>Tài khoản</span>
                    </Link>

                    {user?.role && hasRolePermission(user.role, "SELLER") && (
                      <Link
                        href="/dang-san-pham"
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <IoIosAddCircleOutline className="h-5 w-5 -translate-x-0.5" />
                        <span>Đăng sản phẩm</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={async () => {
                        await logout();
                        clearAuth();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition-colors hover:text-black"
            >
              <FiUser className="h-5 w-5" />
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-700 hover:text-black md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Categories Navigation - Desktop */}
        <nav className="hidden items-center justify-evenly border-t border-gray-200 py-3 md:flex">
          {categories.map((category) => (
            <div key={category.id} className="group relative">
              <Link
                href={`/danh-muc/${category.slug}`}
                className="block rounded px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
              >
                {category.name}
              </Link>

              {/* Subcategories Dropdown */}
              {category.children && category.children.length > 0 && (
                <div className="invisible absolute top-full left-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/danh-muc/${child.slug}`}
                      className="block px-4 py-2 text-center text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-4 px-4 py-4">
            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-gray-400"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              <Link
                href="/danh-muc"
                className="block rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Danh mục
              </Link>
              <Link
                href="/cach-hoat-dong"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cách hoạt động
              </Link>
              <Link
                href="/gioi-thieu"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Về chúng tôi
              </Link>
              <Link
                href="/lien-he"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Liên hệ
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  href="/tai-khoan"
                  className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                >
                  <FiUser className="h-5 w-5" />
                  <span>{user?.fullName}</span>
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-purple-600 px-4 py-2.5 font-semibold text-white hover:bg-purple-700"
                  >
                    <FiTrendingUp className="h-5 w-5" />
                    <span>Bảng điều khiển Admin</span>
                  </Link>
                )}
                {user?.role && hasRolePermission(user.role, "SELLER") && (
                  <Link
                    href="/dang-san-pham"
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-black px-4 py-2.5 font-semibold text-white hover:bg-gray-800"
                  >
                    <FiTrendingUp className="h-5 w-5" />
                    <span>Đăng sản phẩm</span>
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
              >
                <FiUser className="h-5 w-5" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
