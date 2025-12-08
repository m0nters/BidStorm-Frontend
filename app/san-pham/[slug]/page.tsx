import ImageGallery from "@/components/ui/ImageGallery";
import ProductCard from "@/components/ui/ProductCard";
import {
  getAutoExtendByMin,
  getAutoExtendTriggerMin,
} from "@/lib/api/services/config";
import {
  getProductDetailBySlug,
  getRelatedProducts,
} from "@/lib/api/services/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiClock,
  FiEye,
  FiHome,
  FiShoppingCart,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi2";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  try {
    const product = await getProductDetailBySlug(slug);
    const relatedProducts = await getRelatedProducts(product.id);

    const [autoExtendTriggerMin, autoExtendDurationMin] = await Promise.all([
      getAutoExtendTriggerMin(),
      getAutoExtendByMin(),
    ]);

    // Calculate time remaining
    const endTime = new Date(product.endTime);
    const now = new Date();
    const diffInDays = Math.floor(
      (endTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    let timeRemaining = "";
    if (diffInDays <= 3) {
      // Show relative time for products ending within 3 days
      if (diffInDays < 1) {
        const diffInHours = Math.floor(
          (endTime.getTime() - now.getTime()) / (1000 * 60 * 60),
        );
        if (diffInHours < 1) {
          const diffInMinutes = Math.floor(
            (endTime.getTime() - now.getTime()) / (1000 * 60),
          );
          timeRemaining = `${diffInMinutes} phút nữa`;
        } else {
          timeRemaining = `${diffInHours} giờ nữa`;
        }
      } else {
        timeRemaining = `${diffInDays} ngày nữa`;
      }
    } else {
      timeRemaining = endTime.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // User rating display helper
    const UserRating = ({ user }: { user: typeof product.seller }) => {
      const totalRatings = user.positiveRating + user.negativeRating;
      return (
        <div className="flex items-center gap-2">
          <FiUser className="h-4 w-4 text-gray-600" />
          <span className="font-medium">{user.fullName}</span>
          {totalRatings > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <FiStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-green-600">
                {user.ratingPercentage.toFixed(1)}%
              </span>
              <span className="text-gray-500">
                ({user.positiveRating}👍 / {user.negativeRating}👎)
              </span>
            </div>
          )}
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
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <FiHome className="inline h-4 w-4" />
                  Trang chủ
                </Link>
              </li>
              <li>/</li>
              {product.parentCategoryName && (
                <>
                  <li>
                    {" "}
                    <Link
                      href={`/danh-muc/${product.parentCategorySlug}`}
                      className="hover:text-blue-600"
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
                  className="hover:text-blue-600"
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
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h1 className="mb-4 text-2xl font-bold text-gray-900">
                  {product.title}
                </h1>

                {/* Stats */}
                <div className="mb-6 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <HiOutlineBell className="h-4 w-4" />
                    <span>{product.bidCount} lượt</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiEye className="h-4 w-4" />
                    <span>{product.viewCount} lượt xem</span>
                  </div>
                </div>

                {/* Price Info */}
                <div className="space-y-4 border-b pb-6">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Giá hiện tại</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatPrice(product.currentPrice)}
                    </p>
                  </div>

                  {product.hasBuyNow && product.buyNowPrice && (
                    <div>
                      <p className="mb-1 text-sm text-gray-600">Giá mua ngay</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatPrice(product.buyNowPrice)}
                      </p>
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
                <div className="border-b py-6">
                  <div className="mb-2 flex items-center gap-2 text-gray-600">
                    <FiClock className="h-4 w-4" />
                    <span className="text-sm">Thời gian còn lại</span>
                  </div>
                  <p className="text-xl font-bold text-red-600">
                    {product.isEnded ? "Đã kết thúc" : timeRemaining}
                  </p>
                  {product.isAutoExtend && !product.isEnded && (
                    <p className="mt-1 text-xs text-gray-500">
                      * Tự động gia hạn {autoExtendDurationMin} phút nếu có lượt
                      đấu giá mới trong vòng {autoExtendTriggerMin} phút cuối
                      cùng
                    </p>
                  )}
                </div>

                {/* Seller & Bidder Info */}
                <div className="space-y-4 py-6">
                  <div>
                    <p className="mb-2 text-sm text-gray-600">Người bán</p>
                    <UserRating user={product.seller} />
                  </div>

                  {product.highestBidder && (
                    <div>
                      <p className="mb-2 text-sm text-gray-600">
                        Người đặt giá cao nhất
                      </p>
                      <UserRating user={product.highestBidder} />
                    </div>
                  )}

                  {product.winner && (
                    <div>
                      <p className="mb-2 text-sm text-gray-600">Người thắng</p>
                      <UserRating user={product.winner} />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!product.isEnded && (
                  <div className="space-y-3">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700">
                      <HiOutlineBell className="h-5 w-5" />
                      Đặt giá ngay
                    </button>

                    {product.hasBuyNow && (
                      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700">
                        <FiShoppingCart className="h-5 w-5" />
                        Mua ngay
                      </button>
                    )}

                    <button className="w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:border-gray-400">
                      Thêm vào yêu thích
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-2 rounded-lg bg-white p-6 text-sm shadow-sm">
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
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="max-w-3/5 text-gray-600">
                    Cho phép người chưa đánh giá được tham gia đấu giá
                  </span>
                  <span
                    className={`font-medium ${
                      product.allowUnratedBidders
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.allowUnratedBidders ? "Có" : "Không"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Mô tả sản phẩm
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Description Logs */}
            {product.descriptionLogs.length > 0 && (
              <div className="mt-8 border-t pt-8">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Lịch sử cập nhật mô tả
                </h3>
                <div className="space-y-4">
                  {product.descriptionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border-l-4 border-blue-500 py-2 pl-4"
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
          <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Câu hỏi & Trả lời
            </h2>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative mb-6 h-48 w-48">
                <Image
                  src="/no-questions.png"
                  alt="Không tìm thấy câu hỏi"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-gray-500">Chưa có câu hỏi nào</p>
              {!product.isEnded && (
                <button className="mt-4 cursor-pointer font-medium text-blue-600 hover:text-blue-700">
                  Đặt câu hỏi cho người bán
                </button>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Sản phẩm cùng chuyên mục
            </h2>
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16 shadow-sm">
                <div className="relative mb-6 h-48 w-48">
                  <Image
                    src="/no-products-found.png"
                    alt="Không tìm thấy sản phẩm"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
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
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
