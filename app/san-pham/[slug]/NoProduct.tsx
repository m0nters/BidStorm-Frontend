import Image from "next/image";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function NoProduct() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <div className="max-w-2xl text-center">
        {/* No Product Illustration */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/no-products-found.png"
            alt="Không tìm thấy sản phẩm"
            width={350}
            height={318}
            priority
          />
        </div>

        {/* Vietnamese Text */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Không tìm thấy sản phẩm
          </h1>
          <p className="mx-auto max-w-md text-lg text-gray-600">
            Rất tiếc, sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </p>
        </div>

        {/* Action Button */}
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
        </div>
      </div>
    </div>
  );
}
