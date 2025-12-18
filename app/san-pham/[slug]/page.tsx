"use client";

import { ImageGallery, ProductCard } from "@/components/ui";
import { FavoriteButton } from "@/components/ui/product/FavoriteButton";
import { getAutoExtendByMin, getAutoExtendTriggerMin } from "@/services/config";
import {
  getProductDetailBySlug,
  getRelatedProducts,
} from "@/services/products";
import { useAuthStore } from "@/store/authStore";
import { ProductDetailResponse, ProductListResponse } from "@/types/product";
import { formatPrice, formatTimeRemaining } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiClock,
  FiEye,
  FiHome,
  FiShoppingCart,
  FiThumbsDown,
  FiThumbsUp,
} from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi2";
import { RiAuctionFill } from "react-icons/ri";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const isInitializing = useAuthStore((state) => state.isInitializing);

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListResponse[]>(
    [],
  );
  const [autoExtendTriggerMin, setAutoExtendTriggerMin] = useState<number>(0);
  const [autoExtendDurationMin, setAutoExtendDurationMin] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Wait for auth initialization to complete before fetching
    if (isInitializing) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetailBySlug(slug);
        const configTrigger = await getAutoExtendTriggerMin();
        const configDuration = await getAutoExtendByMin();

        setProduct(productData);
        setAutoExtendTriggerMin(configTrigger);
        setAutoExtendDurationMin(configDuration);

        // Fetch related products after we have the product ID
        const related = await getRelatedProducts(productData.id);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, isInitializing]);

  if (isInitializing || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
              <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
    return null;
  }

  // Calculate time remaining
  const timeRemaining = formatTimeRemaining(product.endTime);

  // User rating display helper
  const UserRating = ({ user }: { user: typeof product.seller }) => {
    const totalRatings = user.positiveRating + user.negativeRating;
    return (
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-semibold text-white">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{user.fullName}</p>
            {totalRatings > 0 && (
              <span className="text-sm font-medium text-gray-900">
                ({user.ratingPercentage.toFixed(1)}%)
              </span>
            )}
          </div>
          {totalRatings > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <FiThumbsUp className="h-3.5 w-3.5" />
                {user.positiveRating}
              </span>
              <div className="-translate-y-0.5 text-gray-400 select-none">
                |
              </div>
              <span className="flex items-center gap-1 text-gray-600">
                <FiThumbsDown className="h-3.5 w-3.5" />
                {user.negativeRating}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-black"
              >
                <FiHome className="inline h-4 w-4" />
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            {product.parentCategoryName && (
              <>
                <li>
                  <Link
                    href={`/danh-muc/${product.parentCategorySlug}`}
                    className="hover:text-black"
                  >
                    {product.parentCategoryName}
                  </Link>
                </li>
                <li>/</li>
              </>
            )}
            <li>
              <Link
                href={`/danh-muc/${product.categorySlug}`}
                className="hover:text-black"
              >
                {product.categoryName}
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-900">{product.title}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2">
            <ImageGallery
              images={product.images}
              title={product.title}
              isNew={product.isNew}
              isEnded={product.isEnded}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h1 className="flex-1 text-3xl font-bold text-gray-900">
                  {product.title}
                </h1>

                <FavoriteButton productId={product.id} />
              </div>

              {/* Stats */}
              <div className="mb-6 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <RiAuctionFill className="h-4 w-4" />
                  <span>{product.bidCount} lượt đấu giá</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiEye className="h-4 w-4" />
                  <span>{product.viewCount} lượt xem</span>
                </div>
              </div>

              {/* Price Info */}
              <div className="space-y-4 border-b border-gray-200 pb-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="mb-2 text-sm font-medium text-gray-600">
                    Giá hiện tại
                  </p>
                  <p className="text-4xl font-bold text-black">
                    {formatPrice(product.currentPrice)}
                  </p>
                </div>

                {!product.isEnded &&
                  product.hasBuyNow &&
                  product.buyNowPrice && (
                    <div className="rounded-lg border-2 border-black bg-white p-4">
                      <p className="mb-2 text-sm font-medium text-gray-600">
                        Giá mua ngay
                      </p>
                      <p className="mb-2 text-2xl font-bold text-black">
                        {formatPrice(product.buyNowPrice)}
                      </p>
                      <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-black bg-white py-3 font-semibold text-black transition-all hover:scale-105 hover:bg-black hover:text-white">
                        <FiShoppingCart className="h-5 w-5" />
                        Mua ngay
                      </button>
                    </div>
                  )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Giá khởi điểm</p>
                    <p className="font-medium">
                      {formatPrice(product.startingPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bước giá</p>
                    <p className="font-medium">
                      {formatPrice(product.priceStep)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Remaining */}
              <div className="border-b border-gray-200 py-6">
                <div className="mb-3 flex items-center gap-2 text-gray-600">
                  <FiClock className="h-5 w-5" />
                  <span className="text-sm font-medium">Thời gian còn lại</span>
                </div>
                <div
                  className={`rounded-lg p-3 ${product.isEnded ? "bg-gray-100" : "bg-black"}`}
                >
                  <p
                    className={`text-2xl font-bold ${product.isEnded ? "text-gray-600" : "text-white"}`}
                  >
                    {product.isEnded ? "Đã kết thúc" : timeRemaining}
                  </p>
                </div>
                {product.isAutoExtend && !product.isEnded && (
                  <p className="mt-3 text-xs text-gray-500">
                    * Tự động gia hạn{" "}
                    <span className="font-bold">
                      {autoExtendDurationMin} phút
                    </span>{" "}
                    nếu có lượt đấu giá mới trong vòng{" "}
                    <span className="font-bold">
                      {autoExtendTriggerMin} phút
                    </span>{" "}
                    cuối cùng
                  </p>
                )}
              </div>

              {/* Seller & Bidder Info */}
              <div className="space-y-4 py-6">
                <div>
                  <p className="mb-2 text-sm text-gray-600">Người bán</p>
                  <UserRating user={product.seller} />
                </div>

                {product.highestBidderName && !product.isEnded && (
                  <div>
                    <p className="mb-2 text-sm text-gray-600">
                      Người đặt giá cao nhất
                    </p>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {product.highestBidderName}
                        </p>
                        {product.highestBidderRating !== undefined && (
                          <span className="text-sm font-medium text-gray-900">
                            ({product.highestBidderRating.toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {product.winnerName && product.isEnded && (
                  <div>
                    <p className="mb-2 text-sm text-gray-600">Người thắng</p>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {product.winnerName}
                        </p>
                        {product.winnerRating !== undefined && (
                          <span className="text-sm font-medium text-gray-900">
                            ({product.winnerRating.toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!product.isEnded && (
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800">
                  <HiOutlineBell className="h-5 w-5" />
                  Đặt giá ngay
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 text-sm shadow-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đăng</span>
                <span className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày bắt đầu</span>
                <span className="font-medium">
                  {new Date(product.startTime).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày kết thúc</span>
                <span className="font-medium">
                  {new Date(product.endTime).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="max-w-3/5 text-gray-600">
                  Cho phép người chưa đánh giá được tham gia đấu giá
                </span>
                <span
                  className={`font-semibold ${
                    product.allowUnratedBidders ? "text-black" : "text-gray-400"
                  }`}
                >
                  {product.allowUnratedBidders ? "Có" : "Không"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Mô tả sản phẩm
          </h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* Description Logs */}
          {product.descriptionLogs.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Lịch sử cập nhật mô tả
              </h3>
              <div className="space-y-4">
                {product.descriptionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-lg border-l-4 border-black bg-gray-50 py-3 pr-4 pl-4"
                  >
                    <p className="mb-1 text-sm text-gray-600">
                      ✏️{" "}
                      {new Date(log.updatedAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-900">{log.updatedContent}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Q&A Section */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Câu hỏi & Trả lời
          </h2>
          <div className="flex flex-col items-center justify-center py-8">
            <Image
              src="/no-questions.png"
              alt="Không tìm thấy câu hỏi"
              width={164}
              height={164}
            />
            <p className="text-gray-500">Chưa có câu hỏi nào</p>
            {!product.isEnded && (
              <button className="mt-6 cursor-pointer rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800">
                Hãy là người đầu tiên đặt câu hỏi
              </button>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Sản phẩm cùng chuyên mục
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
              <Image
                src="/no-products-found.png"
                alt="Không tìm thấy sản phẩm"
                width={200}
                height={200}
              />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Không có sản phẩm liên quan
              </h3>
              <p className="text-gray-600">
                Hiện chưa có sản phẩm nào cùng chuyên mục
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
