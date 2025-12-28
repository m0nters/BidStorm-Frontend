"use client";

import { BiddingHistoryTable, ConfirmDialog } from "@/components/ui";
import { useProductBids } from "@/hooks/useProductBids";
import { removeBidder } from "@/services/bids";
import { getProductDetailBySlug } from "@/services/products";
import { useAuthStore } from "@/store/authStore";
import { ProductDetailResponse } from "@/types/product";
import { formatPrice } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

export default function BiddingHistoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const user = useAuthStore((state) => state.user);

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<{
    bidderId: number;
    bidderName: string;
  } | null>(null);

  const isSeller = user?.id === product?.seller?.id;
  const {
    bids,
    loading: bidsLoading,
    currentPrice: realtimePrice,
    endTime: realtimeEndTime,
  } = useProductBids(product?.id || 0, {
    isSeller,
  });

  // Sync real-time price and end time from WebSocket to product state
  useEffect(() => {
    if (!product) return;

    let needsUpdate = false;
    const updates: Partial<ProductDetailResponse> = {};

    if (realtimePrice !== null && realtimePrice !== product.currentPrice) {
      updates.currentPrice = realtimePrice;
      needsUpdate = true;
    }

    if (realtimeEndTime !== null && realtimeEndTime !== product.endTime) {
      updates.endTime = realtimeEndTime;
      needsUpdate = true;
    }

    if (needsUpdate) {
      setProduct((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  }, [realtimePrice, realtimeEndTime, product?.currentPrice, product?.endTime]);

  useEffect(() => {
    if (isInitializing) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetailBySlug(slug);
        setProduct(productData);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, isInitializing]);

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

  if (isInitializing || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
              <p className="text-gray-600">Đang tải lịch sử đấu giá...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href={`/san-pham/${slug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-black"
        >
          <FiArrowLeft className="h-4 w-4" />
          Quay lại sản phẩm
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Lịch sử đấu giá
          </h1>
          <p className="text-gray-600">{product.title}</p>
        </div>

        {/* Bidding History Table */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Tất cả lượt đấu giá ({bidsLoading ? "..." : bids.length})
            </h2>
            <div className="rounded-lg bg-gray-50 px-4 py-2">
              <p className="text-sm text-gray-600">Giá hiện tại</p>
              <p className="text-xl font-bold text-black">
                {formatPrice(product.currentPrice)}
              </p>
            </div>
          </div>

          {bidsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
            </div>
          ) : bids.length > 0 ? (
            <BiddingHistoryTable
              bids={bids}
              currentUserId={user?.id}
              sellerId={product.seller?.id}
              loading={false}
              showActions={true}
              onRemoveBidder={(bidderId, bidderName) =>
                setRemoveConfirm({ bidderId, bidderName })
              }
            />
          ) : (
            <div className="flex flex-col items-center rounded-lg bg-gray-50 py-12">
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
      </div>
    </div>
  );
}
