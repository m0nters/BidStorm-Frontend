"use client";

import { ConfirmDialog } from "@/components/ui";
import { BidResponse } from "@/types/bid";
import { formatDateForFeed, formatFullDateTime } from "@/utils";
import Link from "next/link";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

interface BiddingHistoryTableProps {
  bids: BidResponse[];
  currentUserId?: number;
  sellerId?: number;
  loading?: boolean;
  showActions?: boolean;
  maxRows?: number;
  showFadeEffect?: boolean;
  viewMoreLink?: string;
  isProductEnded?: boolean;
  highestBidderName?: string;
  onRemoveBidder?: (bidderId: number) => Promise<void>;
}

export const BiddingHistoryTable = ({
  bids,
  currentUserId,
  sellerId,
  loading = false,
  showActions = false,
  maxRows,
  showFadeEffect = false,
  isProductEnded = false,
  viewMoreLink,
  highestBidderName,
  onRemoveBidder,
}: BiddingHistoryTableProps) => {
  const isSeller = currentUserId === sellerId;
  const displayBids = maxRows ? bids.slice(0, maxRows) : bids;
  const hasMore = maxRows && bids.length > maxRows;
  
  const [removeConfirm, setRemoveConfirm] = useState<{
    bidderId: number;
    bidderName: string;
  } | null>(null);

  const handleRemoveBidder = async () => {
    if (!removeConfirm || !onRemoveBidder) return;
    
    try {
      await onRemoveBidder(removeConfirm.bidderId);
      setRemoveConfirm(null);
    } catch (error) {
      // Error handling is done in parent
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Người đấu giá
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Giá đặt
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Giá tối đa
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Thời điểm
              </th>
              {showActions && isSeller && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {displayBids.map((bid) => (
              <tr
                key={bid.id}
                className={`border-b last:border-b-0 ${
                  bid.isYourself ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    {bid.isHighestBidder && (
                      <span
                        className="text-yellow-500"
                        title="Người đặt giá cao nhất"
                      >
                        🏆
                      </span>
                    )}
                    <span className="font-medium">
                      {bid.bidderName}
                      {bid.isYourself && (
                        <span className="ml-1 text-xs text-blue-600">
                          (Bạn)
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">
                  {bid.bidAmount.toLocaleString("vi-VN")}₫
                </td>
                {(bid.isYourself || isSeller) && bid.maxBidAmount ? (
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {bid.maxBidAmount.toLocaleString("vi-VN")}₫
                  </td>
                ) : (
                  <td className="px-4 py-3 text-sm text-gray-400">******</td>
                )}
                <td className="px-4 py-3 text-sm text-gray-600">
                  <span title={formatFullDateTime(bid.createdAt)}>
                    {formatDateForFeed(bid.createdAt)}
                  </span>
                </td>
                {showActions &&
                  isSeller &&
                  !isProductEnded &&
                  !bid.isYourself && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setRemoveConfirm({
                            bidderId: bid.bidderId,
                            bidderName: bid.bidderName,
                          })
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        title="Loại người dùng"
                      >
                        <FiTrash2 size={14} />
                        Loại
                      </button>
                    </td>
                  )}
                {showActions && isSeller && bid.isYourself && (
                  <td className="px-4 py-3"></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Fade effect at bottom of table */}
        {showFadeEffect && hasMore && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white via-white/80 to-transparent"></div>
        )}
      </div>

      {/* "View more" button */}
      {hasMore && viewMoreLink && (
        <div className="mt-6 flex justify-center">
          <Link
            href={viewMoreLink}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-black hover:bg-gray-50"
          >
            Xem thêm ({bids.length - maxRows!} lượt đấu giá)
          </Link>
        </div>
      )}

      {/* Remove Bidder Confirmation Dialog */}
      {removeConfirm !== null && (
        <ConfirmDialog
          isOpen={removeConfirm !== null}
          title="Loại người dùng"
          message={
            <>
              Bạn có chắc chắn muốn loại{" "}
              <span className="font-bold text-black">
                {removeConfirm.bidderName}
              </span>{" "}
              khỏi phiên đấu giá này?{" "}
              {removeConfirm.bidderName === highestBidderName
                ? "Đây hiện tại đang là người dùng có đấu giá cao nhất, loại bỏ người dùng này sẽ khiến giá sản phẩm giảm xuống! Người về nhì (nếu có) sẽ lên thay thế."
                : "Tất cả giá đặt của họ sẽ bị xóa."}
              <br />
              <span className="mt-2 block text-sm font-semibold text-red-600 italic">
                Lưu ý: Hành động này KHÔNG THỂ HOÀN TÁC. Người này sẽ bị loại
                khỏi phiên đấu giá này VĨNH VIỄN và KHÔNG THỂ ĐƯỢC THÊM VÀO TRỞ
                LẠI.
              </span>
            </>
          }
          confirmText="Loại"
          cancelText="Hủy"
          onConfirm={handleRemoveBidder}
          onCancel={() => setRemoveConfirm(null)}
        />
      )}
    </div>
  );
};
