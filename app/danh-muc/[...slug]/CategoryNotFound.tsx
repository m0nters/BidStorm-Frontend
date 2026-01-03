import Image from "next/image";
import Link from "next/link";
import { TbCategoryPlus } from "react-icons/tb";

export default function CategoryNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <div className="max-w-2xl text-center">
        {/* Category Not Found Illustration */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/category-not-found.png"
            alt="Không tìm thấy danh mục"
            width={300}
            height={1} // Height will adjust automatically to maintain aspect ratio
            priority
          />
        </div>

        {/* Vietnamese Text */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Không tìm thấy danh mục
          </h1>
          <p className="mx-auto max-w-md text-lg text-gray-600">
            Rất tiếc, danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            Vui lòng kiểm tra lại đường dẫn hoặc khám phá các danh mục khác.
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/danh-muc"
          className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 hover:shadow-lg"
        >
          <TbCategoryPlus className="h-5 w-5 transition-all duration-200 group-hover:-translate-x-1" />
          <p className="transition-all duration-200 group-hover:translate-x-1">
            Khám phá các danh mục khác
          </p>
        </Link>
      </div>
    </div>
  );
}
