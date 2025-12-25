"use client";

import { formatPrice } from "@/utils";
import { useState } from "react";
import { FiX } from "react-icons/fi";

interface BidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
  currentPrice: number;
  minimumBid: number;
  priceStep: number;
}

export const BidDialog = ({
  isOpen,
  onClose,
  onSubmit,
  currentPrice,
  minimumBid,
  priceStep,
}: BidDialogProps) => {
  const [displayValue, setDisplayValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatNumberWithDots = (value: string): string => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";

    // Add thousand separators (dots)
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseFormattedNumber = (value: string): number => {
    // Remove dots and parse as number
    return parseFloat(value.replace(/\./g, "")) || 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatNumberWithDots(rawValue);
    setDisplayValue(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bidValue = parseFormattedNumber(displayValue);

    try {
      setSubmitting(true);
      await onSubmit(bidValue);
      setDisplayValue("");
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setDisplayValue("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Đặt giá đấu giá</h2>
          <button
            onClick={handleClose}
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100"
            disabled={submitting}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-1 text-sm text-gray-600">Giá hiện tại</p>
            <p className="text-2xl font-bold text-black">
              {formatPrice(currentPrice)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="mb-1 text-sm text-gray-600">
              Giá khởi điểm tiếp theo
            </p>
            <p className="text-xl font-bold text-black">
              {formatPrice(minimumBid)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="maxBidAmount"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Số tiền đấu giá tối đa
              <span className="ml-1 text-xs text-gray-500">
                (Hệ thống tự động đấu giá cho bạn)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="maxBidAmount"
                value={displayValue}
                onChange={handleInputChange}
                placeholder={`Tối thiểu ${minimumBid.toLocaleString("vi-VN")}`}
                className="w-full rounded-lg border border-gray-300 py-4 pr-4 pl-4 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
                disabled={submitting}
                autoFocus
              />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-500">
                ₫
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              💡 Hệ thống sẽ tự động đấu giá tăng dần cho bạn cho đến khi đạt
              mức giá tối đa này
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 cursor-pointer rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || !displayValue.trim()}
              className="flex-1 cursor-pointer rounded-lg bg-black py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? "Đang đặt giá..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
