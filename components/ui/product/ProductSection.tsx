"use client";

import { ProductListResponse } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { ProductCard } from "./ProductCard";

interface ProductSectionProps {
  title: string;
  description: string;
  products: ProductListResponse[];
  icon?: React.ReactNode;
  viewAllLink?: string;
}
export function ProductSection({
  title,
  description,
  products,
  icon,
  viewAllLink = "/products",
}: ProductSectionProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-3">
              {icon && <div className="text-black">{icon}</div>}
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {title}
              </h2>
            </div>
            <p className="max-w-2xl text-gray-600">{description}</p>
          </div>
          <Link
            href={viewAllLink}
            className="group hidden items-center space-x-2 rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 transition-all duration-300 hover:border-black hover:text-black md:flex"
          >
            <span className="font-semibold">Xem tất cả</span>
            <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-8 md:hidden">
              <Link
                href={viewAllLink}
                className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 transition-all duration-300 hover:border-black hover:text-black"
              >
                <span className="font-semibold">Xem tất cả</span>
                <FiArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-4">
            <div className="relative mb-8 h-64 w-64 opacity-50">
              <Image
                src="/no-auctions-in-progress.png"
                alt="No auctions available"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              Chưa có sản phẩm
            </h3>
            <p className="mb-6 max-w-md text-center text-gray-600">
              Hiện tại chưa có sản phẩm nào trong phần này. Hãy quay lại sau
              hoặc khám phá các danh mục khác.
            </p>
            <Link
              href="/danh-muc"
              className="group inline-flex items-center space-x-2 rounded-lg bg-black px-6 py-3 text-white transition-all duration-300 hover:bg-gray-800"
            >
              <span className="font-semibold">Khám phá danh mục</span>
              <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
