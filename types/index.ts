export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  rating: number;
  totalRatings: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  currentBid: number;
  buyNowPrice?: number;
  startingBid: number;
  bidIncrement: number;
  endTime: Date;
  createdAt: Date;
  category: Category;
  seller: User;
  highestBidder?: User;
  totalBids: number;
  autoExtend: boolean;
  status: "active" | "ended" | "cancelled";
}

export interface Bid {
  id: string;
  productId: string;
  bidderId: string;
  amount: number;
  createdAt: Date;
  isAutoBid: boolean;
  maxAmount?: number;
}

// Re-export API-related types
export type { CategoryResponse } from "./category";
export type { ProductListResponse } from "./product";
