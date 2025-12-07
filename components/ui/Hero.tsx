"use client";

import Link from "next/link";
import { FiArrowRight, FiRadio } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gray-50 to-white py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-black blur-3xl filter" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gray-800 blur-3xl filter" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl leading-tight font-bold text-gray-900 md:text-6xl lg:text-7xl">
                Khám phá sản phẩm độc đáo
              </h1>
              <h2 className="mt-4 text-2xl font-semibold text-gray-600 md:text-3xl">
                Trải nghiệm cảm giác của đấu giá trực tuyến
              </h2>
            </div>

            <p className="text-lg leading-relaxed text-gray-600">
              Tham gia cùng hàng nghìn người đấu giá trên toàn thế giới và tìm
              kiếm những ưu đãi đặc biệt cho các sản phẩm cao cấp
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/danh-muc"
                className="group inline-flex items-center justify-center space-x-2 rounded-lg bg-black px-8 py-4 text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800"
              >
                <span className="font-semibold">Bắt đầu đấu giá</span>
                <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/cach-hoat-dong"
                className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-8 py-4 text-gray-700 transition-all duration-300 hover:border-black hover:text-black"
              >
                <span className="font-semibold">Cách hoạt động</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-black">36K+</div>
                <div className="mt-1 text-sm text-gray-600">Phiên đấu giá</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">18K+</div>
                <div className="mt-1 text-sm text-gray-600">Người hài lòng</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">99%</div>
                <div className="mt-1 text-sm text-gray-600">
                  Tỷ lệ thành công
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Left */}
              <div className="space-y-4">
                <Link
                  href="danh-muc/dien-tu/dong-ho-thong-minh"
                  className="block"
                >
                  <div className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl bg-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
                      alt="Watch"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Đồng hồ cao cấp</p>
                      <p className="text-xs text-gray-300">500+ Sản phẩm</p>
                    </div>
                  </div>
                </Link>
                <Link href="/danh-muc/thoi-trang-phu-kien" className="block">
                  <div className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl bg-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                      alt="Shoes"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Thời trang</p>
                      <p className="text-xs text-gray-300">1000+ Sản phẩm</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Top Right */}
              <div className="mt-8 space-y-4">
                <Link href="/danh-muc/dien-tu" className="block">
                  <div className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl bg-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
                      alt="Phone"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Điện tử</p>
                      <p className="text-xs text-gray-300">2000+ Sản phẩm</p>
                    </div>
                  </div>
                </Link>
                <Link href="/danh-muc/so-thich-suu-tam" className="block">
                  <div className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl bg-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400"
                      alt="Art"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Sưu tầm</p>
                      <p className="text-xs text-gray-300">300+ Sản phẩm</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 animate-bounce rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FiRadio className="h-8 w-8 text-red-500" />
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">Trực tiếp</div>
                  <div className="text-xs text-gray-600">Đấu giá ngay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
