import { api } from "@/api/fetch";
import {
  ChatMessageResponse,
  ConfirmShipmentRequest,
  InitiatePaymentRequest,
  OrderStatusResponse,
  PaymentIntentResponse,
} from "@/types/order";

/**
 * Create order for a product (Winner only)
 */
export const createOrder = async (
  productId: number,
): Promise<OrderStatusResponse> => {
  const response = await api.post<OrderStatusResponse>(
    `/orders/${productId}/create`,
    null,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Initiate payment with shipping details and get Stripe client secret
 */
export const initiatePayment = async (
  orderId: number,
  paymentData: InitiatePaymentRequest,
): Promise<PaymentIntentResponse> => {
  const response = await api.post<PaymentIntentResponse>(
    `/orders/${orderId}/payment`,
    paymentData,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Get order status (Buyer or Seller)
 */
export const getOrderStatus = async (
  orderId: number,
): Promise<OrderStatusResponse> => {
  const response = await api.get<OrderStatusResponse>(`/orders/${orderId}`, {
    auth: true,
    cache: "no-store",
  });
  return response.data;
};

/**
 * Mark order as shipped (Seller only)
 */
export const markAsShipped = async (
  orderId: number,
  trackingNumber: string,
): Promise<OrderStatusResponse> => {
  const shipmentData: ConfirmShipmentRequest = { trackingNumber };
  const response = await api.post<OrderStatusResponse>(
    `/orders/${orderId}/ship`,
    shipmentData,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Confirm receipt of product (Buyer only)
 */
export const confirmReceipt = async (
  orderId: number,
): Promise<OrderStatusResponse> => {
  const response = await api.post<OrderStatusResponse>(
    `/orders/${orderId}/confirm`,
    null,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Cancel order (Seller only, before payment)
 */
export const cancelOrder = async (
  orderId: number,
): Promise<OrderStatusResponse> => {
  const response = await api.post<OrderStatusResponse>(
    `/orders/${orderId}/cancel`,
    null,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};

/**
 * Get chat history between buyer and seller
 */
export const getChatHistory = async (
  productId: number,
): Promise<ChatMessageResponse[]> => {
  const response = await api.get<ChatMessageResponse[]>(
    `/orders/${productId}/chat`,
    {
      auth: true,
      cache: "no-store",
    },
  );
  return response.data;
};
