// Order-related types

/**
 * Order status enum matching backend
 */
export type OrderStatus =
  | "PENDING_PAYMENT" // Waiting for buyer to pay
  | "PAID" // Money held in escrow, waiting for shipment
  | "SHIPPED" // Seller confirmed shipment
  | "COMPLETED" // Buyer confirmed receipt, money transferred
  | "CANCELLED"; // Seller cancelled before payment

/**
 * Order response from backend
 */
export interface OrderStatusResponse {
  id: number;
  productId: number;
  productTitle: string;
  winnerId: number;
  sellerId: number;
  status: OrderStatus;
  shippingAddress: string | null;
  shippingPhone: string | null;
  trackingNumber: string | null;
  amountCents: number;
  currency: string;
  paidAt: string | null;
  shippedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

/**
 * Payment initiation request
 */
export interface InitiatePaymentRequest {
  shippingAddress: string;
  shippingPhone: string;
}

/**
 * Payment initiation response with Stripe client secret
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  amountCents: number;
  currency: string;
}

/**
 * Shipment confirmation request
 */
export interface ConfirmShipmentRequest {
  trackingNumber: string;
}

/**
 * Chat message from backend
 */
export interface ChatMessageResponse {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  createdAt: string;
  isOwnMessage: boolean;
}

/**
 * Chat message to send via WebSocket
 */
export interface ChatMessageRequest {
  message: string;
}

/**
 * Order status change event from WebSocket
 */
export interface OrderStatusEvent {
  orderId: number;
  status: OrderStatus;
  message: string;
}

/**
 * Chat event from WebSocket
 */
export interface ChatEvent {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  createdAt: string;
}
