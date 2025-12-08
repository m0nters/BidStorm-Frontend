import Image from "next/image";
import Link from "next/link";
import { FiHome, FiUser } from "react-icons/fi";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <div className="max-w-2xl text-center">
        {/* 403 Illustration */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/403.png"
            alt="403 - Không có quyền truy cập"
            width={1883}
            height={1103}
            className="h-auto w-full"
            priority
          />
        </div>

        {/* Vietnamese Text */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Không có quyền truy cập
          </h1>
          <p className="mx-auto max-w-md text-lg text-gray-600">
            Bạn không có quyền truy cập vào trang này. Nội dung này có thể chỉ
            dành cho quản trị viên hoặc người dùng có quyền đặc biệt.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 hover:shadow-lg"
          >
            <FiHome className="h-5 w-5 transition-all duration-200 group-hover:-translate-x-1" />
            <p className="transition-all duration-200 group-hover:translate-x-1">
              Về trang chủ
            </p>
          </Link>
          <Link
            href="/tai-khoan"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-200 hover:border-gray-400 hover:shadow-lg"
          >
            <FiUser className="h-5 w-5 transition-all duration-200 group-hover:-translate-x-1" />
            <p className="transition-all duration-200 group-hover:translate-x-1">
              Tài khoản của tôi
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
