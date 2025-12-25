export interface BidRequest {
  maxBidAmount: number;
}

export interface BidResponse {
  id: number;
  productId: number;
  bidderId: number;
  bidderName: string; // Masked for privacy (****Khoa), unmasked for seller/own bid
  bidAmount: number; // Actual bid amount (current price) - visible to everyone
  maxBidAmount?: number; // Maximum bid - only shown for own bids or to seller
  createdAt: string;
  isYourself?: boolean; // True if viewer is the bidder
  isHighestBidder?: boolean; // True if this bidder is currently the highest bidder (backend determines via automatic bidding algorithm)
}

export interface BidEvent {
  type: "NEW_BID" | "BID_REJECTED";
  productId: number;
  bid?: BidResponse; // For NEW_BID
  currentPrice?: number; // Current product price after bid
  highestBidder?: string; // Name of current highest bidder
  bidderId?: number; // For BID_REJECTED
}
