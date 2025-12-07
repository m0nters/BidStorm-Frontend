"use client";

import { CategoryResponse } from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiSearch, FiUser, FiX } from "react-icons/fi";

interface HeaderProps {
  categories: CategoryResponse[];
}

export default function Header({ categories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* Main Header */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
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
          </Link>

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
          <Link
            href="/dang-nhap"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition-colors hover:text-black"
          >
            <FiUser className="h-5 w-5" />
            <span>Đăng nhập</span>
          </Link>

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
                href={`${category.slug}`}
                className="rounded px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
              >
                {category.name}
              </Link>

              {/* Subcategories Dropdown */}
              {category.children && category.children.length > 0 && (
                <div className="invisible absolute top-full left-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`${child.slug}`}
                      className="block px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
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
            <Link
              href="/dang-nhap"
              className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
            >
              <FiUser className="h-5 w-5" />
              <span>Đăng nhập</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
