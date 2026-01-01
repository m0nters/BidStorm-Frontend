import Image from "next/image";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <div className="max-w-2xl text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/404.png"
            alt="404 - Không tìm thấy trang"
            width={1883}
            height={1103}
            className="h-auto w-full"
            priority
          />
        </div>

        {/* Vietnamese Text */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Không tìm thấy trang
          </h1>
          <p className="mx-auto max-w-md text-lg text-gray-600">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </p>
        </div>

        {/* Action Button */}
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
  );
}
