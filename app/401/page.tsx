import Image from "next/image";
import Link from "next/link";
import { FiHome, FiLogIn } from "react-icons/fi";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <div className="max-w-2xl text-center">
        {/* 401 Illustration */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/401.png"
            alt="401 - Chưa đăng nhập"
            width={1883}
            height={1103}
            className="h-auto w-full"
            priority
          />
        </div>

        {/* Vietnamese Text */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Chưa đăng nhập
          </h1>
          <p className="mx-auto max-w-md text-lg text-gray-600">
            Bạn cần đăng nhập để truy cập trang này. Vui lòng đăng nhập để tiếp
            tục sử dụng các tính năng của BidStorm.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dang-nhap"
            className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg"
          >
            <FiLogIn className="h-5 w-5 transition-all duration-200 group-hover:-translate-x-1" />
            <p className="transition-all duration-200 group-hover:translate-x-1">
              Đăng nhập
            </p>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 hover:shadow-lg"
          >
            <FiHome className="h-5 w-5 transition-all duration-200 group-hover:-translate-x-1" />
            <p className="transition-all duration-200 group-hover:translate-x-1">
              Về trang chủ
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
