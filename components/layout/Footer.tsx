"use client";

import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <div className="flex -translate-y-2 items-center gap-2 text-2xl font-bold">
              <Image
                src="/logo.png"
                alt="BidStorm Logo"
                width={40}
                height={40}
              />
              <div className="select-none">
                <span className="text-white">Bid</span>
                <span className="text-gray-400">Storm</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Sàn đấu giá trực tuyến đáng tin cậy cho các mặt hàng độc đáo và ưu
              đãi tuyệt vời
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <FiYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/danh-muc"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Danh mục
                </Link>
              </li>
              <li>
                <Link
                  href="/cach-hoat-dong"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Cách hoạt động
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/trung-tam-tro-giup"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  href="/huong-dan-nguoi-ban"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Hướng dẫn người bán
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Pháp lý</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dieu-khoan-dich-vu"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-cookie"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Chính sách cookie
                </Link>
              </li>
              <li>
                <Link
                  href="/tu-choi-trach-nhiem"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Từ chối trách nhiệm
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} BidStorm. Bảo lưu mọi quyền.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/sitemap"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Sơ đồ trang
              </Link>
              <Link
                href="/kha-nang-truy-cap"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Khả năng truy cập
              </Link>
              <Link
                href="/bao-mat"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
