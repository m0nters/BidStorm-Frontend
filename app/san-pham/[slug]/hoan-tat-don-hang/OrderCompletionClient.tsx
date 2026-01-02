"use client";

import { ChatPanel } from "@/components/ui/order/ChatPanel";
import { PaymentPanel } from "@/components/ui/order/PaymentPanel";
import { useOrderChat } from "@/hooks/useOrderChat";
import { useOrderStatus } from "@/hooks/useOrderStatus";
import {
  cancelOrder,
  confirmReceipt,
  createOrder,
  getOrderStatus,
  initiatePayment,
  markAsShipped,
} from "@/services/orders";
import { useAuthStore } from "@/store/authStore";
import { ProductDetailResponse } from "@/types";
import { InitiatePaymentRequest, OrderStatusResponse } from "@/types/order";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { toast } from "react-toastify";

interface OrderCompletionClientProps {
  product: ProductDetailResponse;
}

export const OrderCompletionClient = ({
  product,
}: OrderCompletionClientProps) => {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBuyer, setIsBuyer] = useState(false);
  const orderIdRef = useRef<number | null>(null);
  const orderInitializedRef = useRef(false); // prevent calling `initOrder` multiple times (yup, this bug happens)

  // Keep order ID in ref for stable refreshOrder callback
  useEffect(() => {
    orderIdRef.current = order?.id || null;
  }, [order?.id]);

  // Initialize or fetch order
  useEffect(() => {
    // Validate productId
    if (!product.id || isNaN(product.id) || product.id <= 0) {
      setError("ID sản phẩm không hợp lệ");
      setLoading(false);
      return;
    }

    if (orderInitializedRef.current) return;
    orderInitializedRef.current = true;

    const initOrder = async () => {
      try {
        // Create or fetch existing order
        const orderResponse = await createOrder(product.id);
        setOrder(orderResponse);
        setIsBuyer(orderResponse.winnerId === user!.id);
      } catch (error: any) {
        console.error("Failed to load order:", error);
        const errorMessage =
          error?.message || "Không thể tải đơn hàng. Vui lòng thử lại sau.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    initOrder();
  }, [product.id, user]);

  // Refresh order data - use ref to avoid dependency on order
  const refreshOrder = useCallback(async () => {
    const orderId = orderIdRef.current;
    if (!orderId) return;

    try {
      const updatedOrder = await getOrderStatus(orderId);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Failed to refresh order:", error);
    }
  }, []);

  // Real-time chat
  const {
    messages,
    loading: chatLoading,
    connected: chatConnected,
    sendMessage,
  } = useOrderChat({
    productId: product.id,
    accessToken,
    enabled: !!order,
  });

  // Real-time order status updates
  useOrderStatus({
    orderId: order?.id || 0,
    accessToken,
    enabled: !!order,
    onStatusChange: useCallback(
      (event: any) => {
        toast.info(event.message);
        // Refresh order to get latest data
        refreshOrder();
      },
      [refreshOrder],
    ),
  });

  // Payment handlers
  const handleInitiatePayment = async (
    data: InitiatePaymentRequest,
  ): Promise<string> => {
    if (!order) throw new Error("No order found");

    const response = await initiatePayment(order.id, data);
    await refreshOrder();
    return response.clientSecret;
  };

  const handleMarkShipped = async (trackingNumber: string) => {
    if (!order) return;

    await markAsShipped(order.id, trackingNumber);
    await refreshOrder();
  };

  const handleConfirmReceipt = async () => {
    if (!order) return;

    await confirmReceipt(order.id);
    await refreshOrder();
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    await cancelOrder(order.id);
    await refreshOrder();
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600">
            {error || "Không tìm thấy đơn hàng"}
          </p>
          <a
            href="/"
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 hover:shadow-lg"
          >
            <FiHome className="h-5 w-5 transition-all duration-200 group-hover:-translate-x-1" />
            <p className="transition-all duration-200 group-hover:translate-x-1">
              Về trang chủ
            </p>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/san-pham/${product.slug}`)}
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-black"
        >
          <FaChevronLeft />
          Quay lại chi tiết sản phẩm
        </button>
        <h1 className="mt-2 text-3xl font-bold">Hoàn tất đơn hàng</h1>
        <p className="mt-2 text-gray-600">
          {isBuyer
            ? "Theo dõi và hoàn tất đơn hàng của bạn"
            : "Quản lý đơn hàng và giao hàng"}
        </p>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Chat */}
        <div className="max-h-[700px] overflow-hidden rounded-lg border border-gray-200 shadow-sm lg:col-span-2">
          <ChatPanel
            messages={messages}
            onSendMessage={sendMessage}
            loading={chatLoading}
            connected={chatConnected}
            currentUserId={user?.id}
            isBuyer={isBuyer}
          />
        </div>

        {/* Right: Payment/Order Info */}
        <div className="max-h-[700px] overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <PaymentPanel
            order={order}
            productThumbnailUrl={product.images[0].imageUrl}
            productUrl={`/san-pham/${product.slug}`}
            productTitle={product.title}
            productId={product.id}
            isBuyer={isBuyer}
            onInitiatePayment={handleInitiatePayment}
            onMarkShipped={handleMarkShipped}
            onConfirmReceipt={handleConfirmReceipt}
            onCancelOrder={handleCancelOrder}
            onRefreshOrder={refreshOrder}
          />
        </div>
      </div>
    </div>
  );
};
