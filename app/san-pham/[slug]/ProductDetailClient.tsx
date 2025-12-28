"use client";

import {
  BidDialog,
  BiddingHistoryTable,
  ConfirmDialog,
  ImageGallery,
  ProductCard,
  QASection,
  UpdateDescriptionDialog,
  ViewDescriptionHistoryDialog,
} from "@/components/ui";
import { FavoriteButton } from "@/components/ui/product/FavoriteButton";
import { useProductBids } from "@/hooks/useProductBids";
import { placeBid, removeBidder } from "@/services/bids";
import { getAutoExtendByMin, getAutoExtendTriggerMin } from "@/services/config";
import {
  getDescriptionHistory,
  getDescriptionHistoryCount,
  getProductDetailBySlug,
  getRelatedProducts,
  updateProductDescription,
} from "@/services/products";
import { useAuthStore } from "@/store/authStore";
import { ProductDetailResponse, ProductListResponse } from "@/types/product";
import { decodeHTMLEntities, formatPrice, formatTimeRemaining } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiClock,
  FiEye,
  FiHome,
  FiInfo,
  FiShoppingCart,
  FiThumbsDown,
  FiThumbsUp,
} from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi2";
import { RiAuctionFill } from "react-icons/ri";
import { toast } from "react-toastify";
import NoProduct from "./NoProduct";

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({
  slug,
}: ProductDetailClientProps) {
  const pathname = usePathname();
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const user = useAuthStore((state) => state.user);

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListResponse[]>(
    [],
  );
  const [autoExtendTriggerMin, setAutoExtendTriggerMin] = useState<number>(0);
  const [autoExtendDurationMin, setAutoExtendDurationMin] = useState<number>(0);
  const [descriptionHistoryCount, setDescriptionHistoryCount] =
    useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [showUpdateDescriptionDialog, setShowUpdateDescriptionDialog] =
    useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<{
    bidderId: number;
    bidderName: string;
  } | null>(null);

  // Get real-time bid data (only after product is loaded)
  const {
    bids,
    loading: bidsLoading,
    addBidOptimistically,
    currentPrice: realtimePrice,
    highestBidder: realtimeHighestBidder,
    endTime: realtimeEndTime,
  } = useProductBids(product?.id || 0, {
    isSeller: user?.id === product?.seller?.id,
  });

  // Sync real-time price, highest bidder, and end time from WebSocket to product state
  useEffect(() => {
    if (!product) return;

    let needsUpdate = false;
    const updates: Partial<ProductDetailResponse> = {};

    if (realtimePrice !== null && realtimePrice !== product.currentPrice) {
      updates.currentPrice = realtimePrice;
      needsUpdate = true;
    }

    if (
      realtimeHighestBidder !== null &&
      realtimeHighestBidder !== product.highestBidderName
    ) {
      updates.highestBidderName = realtimeHighestBidder;
      needsUpdate = true;
    }

    if (realtimeEndTime !== null && realtimeEndTime !== product.endTime) {
      updates.endTime = realtimeEndTime;
      needsUpdate = true;
    }

    if (needsUpdate) {
      setProduct((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  }, [
    realtimePrice,
    realtimeHighestBidder,
    realtimeEndTime,
    product?.currentPrice,
    product?.highestBidderName,
    product?.endTime,
  ]);

  useEffect(() => {
    // Wait for auth initialization to complete before fetching
    if (isInitializing) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetailBySlug(slug);
        const configTrigger = await getAutoExtendTriggerMin();
        const configDuration = await getAutoExtendByMin();
        const historyCount = await getDescriptionHistoryCount(productData.id);

        setProduct(productData);
        setAutoExtendTriggerMin(configTrigger);
        setAutoExtendDurationMin(configDuration);
        setDescriptionHistoryCount(historyCount);

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
    return NoProduct();
  }

  // Calculate time remaining and minimum bid
  const timeRemaining = formatTimeRemaining(product.endTime);
  const minimumBid = product.currentPrice + product.priceStep;

  const handleBidSubmit = async (bidValue: number) => {
    if (isNaN(bidValue) || bidValue < minimumBid) {
      toast.error(
        `Số tiền đấu giá tối thiểu là ${minimumBid.toLocaleString("vi-VN")}₫`,
      );
      throw new Error("Invalid bid amount");
    }

    try {
      const bidResponse = await placeBid(product.id, {
        maxBidAmount: bidValue,
      });

      toast.success("Đặt giá thành công!");

      // Calculate new price based on bid response
      const newPrice = bidResponse.bidAmount;

      // Add bid optimistically to UI immediately
      // Real-time price/bidder updates will come via WebSocket
      addBidOptimistically(bidResponse, newPrice);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể đặt giá";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleRemoveBidder = async (bidderId: number) => {
    if (!product) return;

    try {
      await removeBidder(product.id, bidderId);
      setRemoveConfirm(null);
      toast.success("Đã loại người dùng khỏi phiên đấu giá");
      // WebSocket will handle removing the bids automatically
    } catch (error) {
      console.error("Error removing bidder:", error);
      toast.error("Không thể loại người dùng");
    }
  };

  const handleUpdateDescription = async (description: string) => {
    if (!product) return;

    try {
      await updateProductDescription(product.id, description);
      toast.success("Cập nhật mô tả thành công!");

      // Reload product and history count
      const updatedProduct = await getProductDetailBySlug(slug);
      const historyCount = await getDescriptionHistoryCount(product.id);
      setProduct(updatedProduct);
      setDescriptionHistoryCount(historyCount);
    } catch (error: any) {
      console.error("Error updating description:", error);
      const errorMessage = error?.message || "Không thể cập nhật mô tả";
      toast.error(errorMessage);
      throw error;
    }
  };

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
                  <span>
                    {bidsLoading ? product.bidCount : bids.length} lượt đấu giá
                  </span>
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

                {!product.isEnded && product.buyNowPrice && (
                  <div className="rounded-lg border-2 border-black bg-white p-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">
                      Giá mua ngay
                    </p>
                    <p className="mb-2 text-2xl font-bold text-black">
                      {formatPrice(product.buyNowPrice)}
                    </p>
                    <button className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-black bg-white py-3 font-semibold text-black transition-all hover:scale-105 hover:bg-black hover:text-white">
                      <FiShoppingCart className="group-hover:animate-shake h-5 w-5" />
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
                    * Tự động gia hạn thêm{" "}
                    <span className="font-bold">
                      {autoExtendDurationMin} phút
                    </span>{" "}
                    nếu có lượt đấu giá mới trong vòng{" "}
                    <span className="font-bold">
                      {autoExtendTriggerMin} phút
                    </span>{" "}
                    trước khi hết giờ. Điều này để tránh các hình thức gian lận
                    đấu giá phút chót.
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
                    <div className="flex items-center gap-1">
                      <p className="mb-2 text-sm text-gray-600">
                        Người đặt giá cao nhất
                      </p>
                      <FiInfo
                        className="h-3 w-3 -translate-y-1 text-gray-400"
                        title="Chỉ người bán mới có thể thấy đầy đủ thông tin các người mua"
                      />
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {product.highestBidderName.includes("*")
                            ? product.highestBidderName
                            : `${product.highestBidderName} (Bạn)`}
                        </p>
                        {product.highestBidderRating !== undefined &&
                          product.highestBidderRating !== null && (
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
              {!product.isEnded && user && (
                <button
                  onClick={() => setShowBidDialog(true)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800"
                >
                  <HiOutlineBell className="h-5 w-5" />
                  Đặt giá ngay
                </button>
              )}
              {!product.isEnded && !user && (
                <Link
                  href={`/dang-nhap?redirectTo=${encodeURIComponent(pathname)}`}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800"
                >
                  <HiOutlineBell className="h-5 w-5" />
                  Đăng nhập để đấu giá
                </Link>
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
                  Cho phép ai cũng được tham gia đấu giá bất kể rating
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
          <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mô tả sản phẩm</h2>
            <div className="flex items-center gap-3">
              {descriptionHistoryCount > 0 && (
                <button
                  onClick={() => setShowHistoryDialog(true)}
                  className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-black hover:bg-gray-50"
                >
                  Xem lịch sử chỉnh sửa
                </button>
              )}
              {user?.id === product.seller?.id && !product.isEnded && (
                <button
                  onClick={() => setShowUpdateDescriptionDialog(true)}
                  className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-black hover:bg-gray-50"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
          <div
            className="prose prose-slate max-w-none wrap-break-word"
            style={{
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              whiteSpace: "pre-line",
            }}
            dangerouslySetInnerHTML={{
              __html: decodeHTMLEntities(product.description),
            }}
          />
        </div>

        {/* Q&A Section */}
        <QASection
          productId={product.id}
          isEnded={product.isEnded}
          isSeller={user?.id === product.seller?.id}
        />

        {/* Bidding History Section */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Lịch sử đấu giá
            </h2>
            {bids.length > 0 && (
              <Link
                href={`/san-pham/${slug}/lich-su-dau-gia`}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-black hover:bg-gray-50"
              >
                Xem chi tiết
              </Link>
            )}
          </div>
          {bids.length > 0 && (
            <p className="text-sm text-gray-600">(10 lượt gần nhất)</p>
          )}

          {bidsLoading ? (
            <div className="mt-6 flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
            </div>
          ) : bids.length > 0 ? (
            <div className="mt-6">
              <BiddingHistoryTable
                bids={bids}
                currentUserId={user?.id}
                sellerId={product.seller?.id}
                loading={false}
                showActions={true}
                maxRows={10}
                showFadeEffect={true}
                viewMoreLink={`/san-pham/${slug}/lich-su-dau-gia`}
                onRemoveBidder={(bidderId, bidderName) =>
                  setRemoveConfirm({ bidderId, bidderName })
                }
              />
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-lg py-12">
              <Image
                src="/no-bid.png"
                alt="Chưa có người đấu giá"
                width={150}
                height={150}
              />
              <p className="mt-4 text-gray-500">Chưa có người đấu giá</p>
              <p className="font-semibold">
                Hãy là người đầu tiên đặt giá cho sản phẩm này!
              </p>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Sản phẩm liên quan
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

      {/* Bid Dialog */}
      <BidDialog
        isOpen={showBidDialog}
        onClose={() => setShowBidDialog(false)}
        onSubmit={handleBidSubmit}
        currentPrice={product.currentPrice}
        minimumBid={minimumBid}
        priceStep={product.priceStep}
      />

      {/* Remove Bidder Confirmation Dialog */}
      {removeConfirm !== null && (
        <ConfirmDialog
          isOpen={removeConfirm !== null}
          title="Loại người dùng"
          message={`Bạn có chắc chắn muốn loại ${removeConfirm.bidderName} khỏi phiên đấu giá này? Tất cả giá đặt của họ sẽ bị xóa.`}
          confirmText="Loại"
          cancelText="Hủy"
          onConfirm={() =>
            removeConfirm && handleRemoveBidder(removeConfirm.bidderId)
          }
          onCancel={() => setRemoveConfirm(null)}
        />
      )}

      {/* Update Description Dialog */}
      <UpdateDescriptionDialog
        isOpen={showUpdateDescriptionDialog}
        onClose={() => setShowUpdateDescriptionDialog(false)}
        onSubmit={handleUpdateDescription}
      />

      {/* View Description History Dialog */}
      <ViewDescriptionHistoryDialog
        isOpen={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        productId={product.id}
        fetchHistory={getDescriptionHistory}
      />
    </div>
  );
}
