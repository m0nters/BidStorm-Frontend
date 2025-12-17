"use client";
import Image from "next/image";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Không tìm thấy sản phẩm",
  description = "Hiện tại không có sản phẩm nào trong danh mục này. Vui lòng quay lại sau hoặc khám phá các danh mục khác.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12">
      <div className="text-center">
        {/* Icon */}
        <Image
          src="/no-products-found.png"
          alt="No Products Found"
          width={200}
          height={200}
          className="mx-auto mb-6"
        />

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>

        {/* Description */}
        <p className="mx-auto max-w-md text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
