"use client";

import { ConfirmDialog } from "@/components/ui/common";
import { getUserReviewForProduct } from "@/services/reviews";
import { ReviewResponse } from "@/types";
import {
  InitiatePaymentRequest,
  OrderStatus,
  OrderStatusResponse,
} from "@/types/order";
import { formatFullDateTime } from "@/utils/dateTime";
import { formatPrice } from "@/utils/price";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import {
  FiCheck,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { ReviewDialog } from "./ReviewDialog";

// Initialize Stripe (you should get this from env or config)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key",
);

interface PaymentPanelProps {
  order: OrderStatusResponse;
  productThumbnailUrl: string;
  productUrl: string;
  productTitle: string;
  productId: number;
  isBuyer: boolean;
  onInitiatePayment: (data: InitiatePaymentRequest) => Promise<string>; // Returns clientSecret
  onMarkShipped: (trackingNumber: string) => Promise<void>;
  onConfirmReceipt: () => Promise<void>;
  onCancelOrder: () => Promise<void>;
  onRefreshOrder: () => Promise<void>;
}

export const PaymentPanel = ({
  order,
  productThumbnailUrl,
  productUrl,
  productTitle,
  productId,
  isBuyer,
  onInitiatePayment,
  onMarkShipped,
  onConfirmReceipt,
  onCancelOrder,
  onRefreshOrder,
}: PaymentPanelProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState(
    order.shippingAddress || "",
  );
  const [shippingPhone, setShippingPhone] = useState(order.shippingPhone || "");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewResponse | null>(
    null,
  );
  const [loadingReviewStatus, setLoadingReviewStatus] = useState(true);

  // Update form fields when order changes (e.g., from WebSocket)
  useEffect(() => {
    if (order.shippingAddress) setShippingAddress(order.shippingAddress);
    if (order.shippingPhone) setShippingPhone(order.shippingPhone);
  }, [order.shippingAddress, order.shippingPhone]);

  // Clear clientSecret when payment is completed
  useEffect(() => {
    if (order.status !== "PENDING_PAYMENT" && clientSecret) {
      setClientSecret(null);
    }
  }, [order.status, clientSecret]);

  // Fetch review status
  useEffect(() => {
    const fetchReviewStatus = async () => {
      try {
        setLoadingReviewStatus(true);
        const review = await getUserReviewForProduct(productId);
        setExistingReview(review);
      } catch (error) {
        console.error("Failed to fetch review status:", error);
      } finally {
        setLoadingReviewStatus(false);
      }
    };
    fetchReviewStatus();
  }, [productId]);

  // Auto-initiate payment if shipping info already exists (unless user wants to edit)
  useEffect(() => {
    if (
      isBuyer &&
      order.status === "PENDING_PAYMENT" &&
      !clientSecret &&
      order.shippingAddress &&
      order.shippingPhone &&
      !loading &&
      !showShippingForm
    ) {
      handleInitiatePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    order.status,
    order.shippingAddress,
    order.shippingPhone,
    showShippingForm,
  ]);

  // Get status display info
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return {
          label: "Chờ thanh toán",
          description: "Người mua cần thanh toán và cung cấp địa chỉ giao hàng",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
      case "PAID":
        return {
          label: "Đã thanh toán",
          description: "Tiền đã được giữ an toàn. Chờ người bán gửi hàng",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "SHIPPED":
        return {
          label: "Đã gửi hàng",
          description: "Người bán đã gửi hàng. Chờ người mua xác nhận",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        };
      case "COMPLETED":
        return {
          label: "Hoàn tất",
          description: "Giao dịch hoàn tất. Tiền đã chuyển cho người bán",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          description: "Người bán đã hủy đơn hàng",
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  // Handle payment initiation
  const handleInitiatePayment = async () => {
    if (!shippingAddress.trim() || !shippingPhone.trim()) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ và số điện thoại");
      return;
    }

    if (!/^\d{10,15}$/.test(shippingPhone)) {
      toast.error("Số điện thoại không hợp lệ (10-15 chữ số)");
      return;
    }

    try {
      setLoading(true);
      const secret = await onInitiatePayment({
        shippingAddress,
        shippingPhone,
      });
      setClientSecret(secret);
      setShowShippingForm(false);
      toast.success("Đã khởi tạo thanh toán. Vui lòng nhập thông tin thẻ");
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      toast.error("Không thể khởi tạo thanh toán");
    } finally {
      setLoading(false);
    }
  };

  // Handle shipping form submit (Enter key or submit button)
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleInitiatePayment();
  };

  // Handle back to shipping form
  const handleBackToShipping = () => {
    setClientSecret(null);
    setShowShippingForm(true);
  };

  // Handle mark as shipped
  const handleMarkShipped = async () => {
    if (!trackingNumber.trim()) {
      toast.error("Vui lòng nhập mã vận đơn");
      return;
    }

    try {
      setLoading(true);
      await onMarkShipped(trackingNumber);
      toast.success("Đã đánh dấu đã gửi hàng");
      setTrackingNumber("");
      await onRefreshOrder();
    } catch (error) {
      console.error("Failed to mark as shipped:", error);
      toast.error("Không thể đánh dấu đã gửi hàng");
    } finally {
      setLoading(false);
    }
  };

  // Submit handler for mark-as-shipped form (Enter key)
  const handleMarkShippedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleMarkShipped();
  };

  // Handle confirm receipt
  const handleConfirmReceipt = async () => {
    try {
      setLoading(true);
      setShowConfirmDialog(false);
      await onConfirmReceipt();
      toast.success("Đã xác nhận nhận hàng. Giao dịch hoàn tất!");
      await onRefreshOrder();
    } catch (error) {
      console.error("Failed to confirm receipt:", error);
      toast.error("Không thể xác nhận nhận hàng");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      setShowCancelDialog(false);
      await onCancelOrder();
      toast.success("Đã hủy đơn hàng");
      await onRefreshOrder();
    } catch (error: any) {
      console.error("Failed to cancel order:", error);
      const errorMessage = error?.message || "Không thể hủy đơn hàng";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-gray-200 p-6">
        <Link href={productUrl} className="overflow-hidden">
          <Image
            src={productThumbnailUrl}
            alt={order.productTitle}
            width={100}
            height={200}
            className="translate-y-1 object-cover transition-transform duration-300 hover:scale-110"
          />
        </Link>
        <div>
          <h2 className="text-xl font-semibold">Hoàn tất đơn hàng</h2>
          <Link
            href={productUrl}
            className="mt-1 text-sm text-gray-600 hover:underline"
          >
            {order.productTitle}
          </Link>
          <p className="mt-2 text-2xl font-bold">
            {formatPrice(order.amountCents, order.currency)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Status */}
        <div className={`mb-6 rounded-lg p-4 ${statusInfo.bgColor}`}>
          <div className="flex items-center gap-2">
            <FiPackage className={statusInfo.color} size={20} />
            <span className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700">{statusInfo.description}</p>
        </div>

        {/* Timeline */}
        <div className="mb-6 space-y-4">
          <h3 className="font-semibold">Tiến trình</h3>
          <div className="space-y-3">
            <TimelineItem
              icon={<FiCheck />}
              label="Đơn hàng được tạo"
              completed={true}
              isFirstItem={true}
              timestamp={order.createdAt}
            />
            <TimelineItem
              icon={<FiCheck />}
              label="Đã thanh toán"
              completed={
                order.status === "PAID" ||
                order.status === "SHIPPED" ||
                order.status === "COMPLETED"
              }
              timestamp={order.paidAt}
            />
            <TimelineItem
              icon={<FiTruck />}
              label="Đã gửi hàng"
              completed={
                order.status === "SHIPPED" || order.status === "COMPLETED"
              }
              timestamp={order.shippedAt}
            />
            <TimelineItem
              icon={<FiPackage />}
              label="Đã nhận hàng"
              completed={order.status === "COMPLETED"}
              timestamp={order.completedAt}
            />
          </div>
        </div>

        {/* Shipping Info */}
        {order.shippingAddress && (
          <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 font-semibold">Thông tin giao hàng</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <FiMapPin className="mt-0.5 text-gray-500" />
                <span>{order.shippingAddress}</span>
              </div>
              <div className="flex gap-2">
                <FiPhone className="mt-0.5 text-gray-500" />
                <span>{order.shippingPhone}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex gap-2">
                  <FiTruck className="mt-0.5 text-gray-500" />
                  <span>
                    Mã vận đơn: <strong>{order.trackingNumber}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions based on status and role */}
        <div className="space-y-4">
          {/* Buyer - Pending Payment */}
          {isBuyer &&
            order.status === "PENDING_PAYMENT" &&
            !clientSecret &&
            (showShippingForm || !order.shippingAddress) && (
              <div className="space-y-3">
                <h3 className="font-semibold">Địa chỉ giao hàng</h3>
                <form onSubmit={handleShippingSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Địa chỉ nhận hàng"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại (10-15 chữ số)"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-lg bg-black px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận địa chỉ nhận hàng"}
                  </button>
                </form>
              </div>
            )}

          {/* Buyer - Payment Form */}
          {isBuyer && order.status === "PENDING_PAYMENT" && clientSecret && (
            <div className="space-y-4">
              <button
                onClick={handleBackToShipping}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-black"
              >
                <FaChevronLeft />
                Sửa địa chỉ giao hàng
              </button>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  onSuccess={onRefreshOrder}
                />
              </Elements>
            </div>
          )}

          {/* Buyer - Paid Status */}
          {isBuyer && order.status === "PAID" && (
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <FiCheck className="mx-auto mb-2 text-blue-600" size={32} />
              <p className="font-semibold text-blue-600">
                Thanh toán thành công!
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Tiền đã được giữ an toàn. Chờ người bán gửi hàng...
              </p>
            </div>
          )}

          {/* Seller - Pending Payment Status */}
          {!isBuyer && order.status === "PENDING_PAYMENT" && (
            <div className="space-y-3">
              <div className="rounded-lg bg-yellow-50 p-4 text-center">
                <p className="text-sm text-gray-700">
                  Chờ người mua thanh toán
                </p>
              </div>
              <button
                onClick={() => setShowCancelDialog(true)}
                disabled={loading}
                className="w-full cursor-pointer rounded-lg border-2 border-red-600 bg-white px-4 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-400"
              >
                {loading ? "Đang xử lý..." : "Hủy đơn hàng"}
              </button>
            </div>
          )}

          {/* Seller - Paid Status */}
          {!isBuyer && order.status === "PAID" && (
            <div className="space-y-3">
              <h3 className="font-semibold">Xác nhận gửi hàng</h3>
              <form onSubmit={handleMarkShippedSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nhập mã vận đơn"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-lg bg-black px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận đã gửi hàng"}
                </button>
              </form>
            </div>
          )}

          {/* Buyer - Shipped Status */}
          {isBuyer && order.status === "SHIPPED" && (
            <div>
              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={loading}
                className="w-full cursor-pointer rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-300"
              >
                {loading ? "Đang xử lý..." : "Xác nhận đã nhận hàng"}
              </button>
              <p className="mt-2 text-center text-xs text-gray-600">
                Chỉ xác nhận khi bạn đã nhận hàng
              </p>
            </div>
          )}

          {/* Completed */}
          {order.status === "COMPLETED" && (
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <FiCheck className="mx-auto mb-2 text-green-600" size={32} />
              <p className="font-semibold text-green-600">Giao dịch hoàn tất</p>
              <p className="mt-1 text-sm text-gray-700">
                {isBuyer
                  ? "Cảm ơn bạn đã mua hàng!"
                  : "Tiền đã được chuyển vào tài khoản của bạn"}
              </p>
            </div>
          )}

          {/* Cancelled */}
          {order.status === "CANCELLED" && (
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="font-semibold text-red-600">Đơn hàng đã bị hủy</p>
              <p className="mt-1 text-sm text-gray-700">
                {isBuyer
                  ? "Người bán đã hủy đơn hàng"
                  : "Bạn đã hủy đơn hàng này"}
              </p>
            </div>
          )}
        </div>

        {/* Independent Review Section - Always visible except when cancelled */}
        {order.status !== "CANCELLED" && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowReviewDialog(true)}
              disabled={loadingReviewStatus}
              className={
                `flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-semibold transition-colors ` +
                (existingReview
                  ? "border-black bg-black text-white hover:bg-gray-800 disabled:bg-gray-800/50"
                  : "border-black bg-white text-black hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400")
              }
            >
              <FiStar
                className={`h-5 w-5 ${existingReview ? "text-white" : "text-black"}`}
              />
              {existingReview
                ? isBuyer
                  ? "Đánh giá lại người bán"
                  : "Đánh giá lại người mua"
                : isBuyer
                  ? "Đánh giá người bán"
                  : "Đánh giá người mua"}
            </button>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Xác nhận đã nhận hàng"
        message="Thao tác này không thể hoàn tác, người mua sẽ nhận được tiền ngay sau đó, bạn không thể khiếu nại trong tương lai. Bạn chắc chắn đã nhận được hàng?"
        confirmText="Đã nhận hàng"
        cancelText="Hủy"
        onConfirm={handleConfirmReceipt}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {/* Cancel Order Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Hủy đơn hàng"
        message={
          <div className="space-y-2">
            <p>Bạn chắc chắn muốn hủy đơn hàng này?</p>
            <p className="text-sm text-gray-600">
              Người mua sẽ nhận được thông báo về việc hủy đơn hàng.
            </p>
          </div>
        }
        confirmText="Hủy đơn hàng"
        cancelText="Không"
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelDialog(false)}
      />

      {/* Review Dialog */}
      <ReviewDialog
        isOpen={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        productId={productId}
        productTitle={productTitle}
        title={
          existingReview
            ? isBuyer
              ? "Đánh giá lại người bán"
              : "Đánh giá lại người mua"
            : isBuyer
              ? "Đánh giá người bán"
              : "Đánh giá người mua"
        }
        hasReviewed={existingReview !== null}
        existingReview={existingReview}
        onReviewSubmitted={async () => {
          // Refetch the review to update the UI
          const review = await getUserReviewForProduct(productId);
          setExistingReview(review);
          onRefreshOrder();
        }}
      />
    </div>
  );
};

// Timeline Item Component
interface TimelineItemProps {
  icon: React.ReactNode;
  label: string;
  completed: boolean;
  timestamp?: string | null;
  isFirstItem?: boolean;
}

const TimelineItem = ({
  icon,
  label,
  completed,
  timestamp,
  isFirstItem = false,
}: TimelineItemProps) => (
  <div className="flex items-start gap-3">
    <div className="relative">
      {/* Top connector (connects to previous step) */}
      {!isFirstItem && (
        <div
          className={`absolute -top-8 left-1/2 h-10 w-0.5 -translate-x-1/2 ${
            completed ? "bg-green-600" : "bg-gray-200"
          } z-0`}
        />
      )}

      <div
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
          completed
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {icon}
      </div>
    </div>

    <div className="flex-1">
      <p
        className={`font-medium ${completed ? "text-black" : "text-gray-400"}`}
      >
        {label}
      </p>
      {timestamp && (
        <p className="text-xs text-gray-500">{formatFullDateTime(timestamp)}</p>
      )}
    </div>
  </div>
);

// Stripe Checkout Form
interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

const CheckoutForm = ({ clientSecret, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        },
      );

      if (error) {
        toast.error(`Thanh toán thất bại: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        toast.success("Thanh toán thành công! Chờ người bán gửi hàng...");
        // Wait for webhook to update order status, then refresh
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Đã xảy ra lỗi khi thanh toán");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold">Thông tin thẻ</h3>
      <div className="rounded-lg border border-gray-300 p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#000",
                "::placeholder": {
                  color: "#aaa",
                },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full cursor-pointer rounded-lg bg-black px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300"
      >
        {processing ? "Đang xử lý..." : "Thanh toán ngay"}
      </button>
      <p className="text-center text-xs text-gray-600">
        Test card: 4242 4242 4242 4242
      </p>
    </form>
  );
};
