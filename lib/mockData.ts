import { Category, Product } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    children: [
      {
        id: "1-1",
        name: "Mobile Phones",
        slug: "mobile-phones",
        parentId: "1",
      },
      { id: "1-2", name: "Laptops", slug: "laptops", parentId: "1" },
      { id: "1-3", name: "Tablets", slug: "tablets", parentId: "1" },
    ],
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    children: [
      { id: "2-1", name: "Shoes", slug: "shoes", parentId: "2" },
      { id: "2-2", name: "Watches", slug: "watches", parentId: "2" },
      { id: "2-3", name: "Bags", slug: "bags", parentId: "2" },
    ],
  },
  {
    id: "3",
    name: "Home & Garden",
    slug: "home-garden",
    children: [
      { id: "3-1", name: "Furniture", slug: "furniture", parentId: "3" },
      { id: "3-2", name: "Kitchen", slug: "kitchen", parentId: "3" },
    ],
  },
  {
    id: "4",
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    children: [
      {
        id: "4-1",
        name: "Exercise Equipment",
        slug: "exercise-equipment",
        parentId: "4",
      },
      { id: "4-2", name: "Camping", slug: "camping", parentId: "4" },
    ],
  },
  {
    id: "5",
    name: "Collectibles",
    slug: "collectibles",
    children: [
      { id: "5-1", name: "Art", slug: "art", parentId: "5" },
      { id: "5-2", name: "Antiques", slug: "antiques", parentId: "5" },
    ],
  },
];

const now = new Date();

export const mockProducts: Product[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB - Natural Titanium",
    description: "Brand new, sealed iPhone 15 Pro Max with 256GB storage",
    images: [
      "https://images.unsplash.com/photo-1696446702183-cbd0174e00e9?w=800",
      "https://images.unsplash.com/photo-1696446702183-cbd0174e00e9?w=800",
      "https://images.unsplash.com/photo-1696446702183-cbd0174e00e9?w=800",
    ],
    currentBid: 28500000,
    buyNowPrice: 32000000,
    startingBid: 25000000,
    bidIncrement: 100000,
    endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours
    createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    category: {
      id: "1-1",
      name: "Mobile Phones",
      slug: "mobile-phones",
      parentId: "1",
    },
    seller: {
      id: "s1",
      name: "TechStore VN",
      email: "tech@store.vn",
      rating: 95,
      totalRatings: 250,
    },
    highestBidder: {
      id: "b1",
      name: "****Khoa",
      email: "",
      rating: 88,
      totalRatings: 45,
    },
    totalBids: 127,
    autoExtend: true,
    status: "active",
  },
  {
    id: "2",
    title: 'MacBook Pro 16" M3 Max - Space Black',
    description: "Latest MacBook Pro with M3 Max chip, 64GB RAM, 2TB SSD",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    ],
    currentBid: 85000000,
    buyNowPrice: 95000000,
    startingBid: 75000000,
    bidIncrement: 500000,
    endTime: new Date(now.getTime() + 45 * 60 * 1000), // 45 minutes
    createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    category: { id: "1-2", name: "Laptops", slug: "laptops", parentId: "1" },
    seller: {
      id: "s2",
      name: "Apple Premium",
      email: "info@apple.vn",
      rating: 98,
      totalRatings: 450,
    },
    highestBidder: {
      id: "b2",
      name: "****Minh",
      email: "",
      rating: 92,
      totalRatings: 78,
    },
    totalBids: 213,
    autoExtend: true,
    status: "active",
  },
  {
    id: "3",
    title: "Rolex Submariner Date - Stainless Steel",
    description: "Authentic Rolex Submariner with box and papers",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
    ],
    currentBid: 245000000,
    startingBid: 200000000,
    bidIncrement: 1000000,
    endTime: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes
    createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
    category: { id: "2-2", name: "Watches", slug: "watches", parentId: "2" },
    seller: {
      id: "s3",
      name: "Luxury Watches",
      email: "luxury@watches.vn",
      rating: 99,
      totalRatings: 320,
    },
    highestBidder: {
      id: "b3",
      name: "****Tuấn",
      email: "",
      rating: 95,
      totalRatings: 120,
    },
    totalBids: 189,
    autoExtend: false,
    status: "active",
  },
  {
    id: "4",
    title: "Nike Air Jordan 1 Retro High OG - Chicago",
    description: "Deadstock Nike Air Jordan 1 in iconic Chicago colorway",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    ],
    currentBid: 12500000,
    buyNowPrice: 15000000,
    startingBid: 10000000,
    bidIncrement: 100000,
    endTime: new Date(now.getTime() + 5 * 60 * 60 * 1000), // 5 hours
    createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    category: { id: "2-1", name: "Shoes", slug: "shoes", parentId: "2" },
    seller: {
      id: "s4",
      name: "Sneaker Heaven",
      email: "sneaker@heaven.vn",
      rating: 94,
      totalRatings: 180,
    },
    highestBidder: {
      id: "b4",
      name: "****Long",
      email: "",
      rating: 87,
      totalRatings: 34,
    },
    totalBids: 98,
    autoExtend: true,
    status: "active",
  },
  {
    id: "5",
    title: "Samsung Galaxy S24 Ultra 512GB - Titanium Gray",
    description: "Brand new Samsung flagship phone with S Pen",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
    ],
    currentBid: 24000000,
    buyNowPrice: 27000000,
    startingBid: 20000000,
    bidIncrement: 100000,
    endTime: new Date(now.getTime() + 90 * 60 * 1000), // 90 minutes
    createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000),
    category: {
      id: "1-1",
      name: "Mobile Phones",
      slug: "mobile-phones",
      parentId: "1",
    },
    seller: {
      id: "s5",
      name: "Samsung Official",
      email: "samsung@official.vn",
      rating: 97,
      totalRatings: 380,
    },
    highestBidder: {
      id: "b5",
      name: "****Huy",
      email: "",
      rating: 90,
      totalRatings: 67,
    },
    totalBids: 156,
    autoExtend: true,
    status: "active",
  },
  {
    id: "6",
    title: "Sony PlayStation 5 Digital Edition Bundle",
    description: "PS5 Digital with 2 controllers and 3 games",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
    ],
    currentBid: 11500000,
    buyNowPrice: 13000000,
    startingBid: 9000000,
    bidIncrement: 100000,
    endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours
    createdAt: new Date(now.getTime() - 18 * 60 * 60 * 1000),
    category: { id: "1", name: "Electronics", slug: "electronics" },
    seller: {
      id: "s6",
      name: "Gaming Store",
      email: "gaming@store.vn",
      rating: 93,
      totalRatings: 210,
    },
    highestBidder: {
      id: "b6",
      name: "****Nam",
      email: "",
      rating: 85,
      totalRatings: 23,
    },
    totalBids: 145,
    autoExtend: true,
    status: "active",
  },
  {
    id: "7",
    title: "Canon EOS R5 Mirrorless Camera Body",
    description:
      "Professional full-frame mirrorless camera, like new condition",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    ],
    currentBid: 65000000,
    startingBid: 55000000,
    bidIncrement: 500000,
    endTime: new Date(now.getTime() + 120 * 60 * 1000), // 2 hours
    createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
    category: { id: "1", name: "Electronics", slug: "electronics" },
    seller: {
      id: "s7",
      name: "Camera Pro",
      email: "camera@pro.vn",
      rating: 96,
      totalRatings: 290,
    },
    highestBidder: {
      id: "b7",
      name: "****Dũng",
      email: "",
      rating: 91,
      totalRatings: 56,
    },
    totalBids: 167,
    autoExtend: false,
    status: "active",
  },
  {
    id: "8",
    title: "Hermès Birkin 30 - Togo Leather Black",
    description: "Authentic Hermès Birkin bag with stamp and receipt",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    ],
    currentBid: 320000000,
    startingBid: 280000000,
    bidIncrement: 2000000,
    endTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours
    createdAt: new Date(now.getTime() - 96 * 60 * 60 * 1000),
    category: { id: "2-3", name: "Bags", slug: "bags", parentId: "2" },
    seller: {
      id: "s8",
      name: "Luxury Fashion",
      email: "luxury@fashion.vn",
      rating: 99,
      totalRatings: 410,
    },
    highestBidder: {
      id: "b8",
      name: "****Linh",
      email: "",
      rating: 96,
      totalRatings: 145,
    },
    totalBids: 234,
    autoExtend: true,
    status: "active",
  },
  {
    id: "9",
    title: 'iPad Pro 12.9" M2 WiFi + Cellular 1TB',
    description: "Latest iPad Pro with Magic Keyboard and Apple Pencil",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    ],
    currentBid: 38000000,
    buyNowPrice: 42000000,
    startingBid: 32000000,
    bidIncrement: 200000,
    endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours
    createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000),
    category: { id: "1-3", name: "Tablets", slug: "tablets", parentId: "1" },
    seller: {
      id: "s9",
      name: "Apple Store",
      email: "apple@store.vn",
      rating: 98,
      totalRatings: 520,
    },
    highestBidder: {
      id: "b9",
      name: "****Phong",
      email: "",
      rating: 89,
      totalRatings: 51,
    },
    totalBids: 178,
    autoExtend: true,
    status: "active",
  },
  {
    id: "10",
    title: "Omega Speedmaster Professional Moonwatch",
    description: "Iconic Omega Moonwatch with manual winding movement",
    images: [
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    currentBid: 135000000,
    startingBid: 120000000,
    bidIncrement: 500000,
    endTime: new Date(now.getTime() + 150 * 60 * 1000), // 2.5 hours
    createdAt: new Date(now.getTime() - 60 * 60 * 60 * 1000),
    category: { id: "2-2", name: "Watches", slug: "watches", parentId: "2" },
    seller: {
      id: "s10",
      name: "Watch Collector",
      email: "watch@collector.vn",
      rating: 97,
      totalRatings: 275,
    },
    highestBidder: {
      id: "b10",
      name: "****Quân",
      email: "",
      rating: 93,
      totalRatings: 89,
    },
    totalBids: 201,
    autoExtend: false,
    status: "active",
  },
];

// Get products sorted by different criteria
export const getEndingSoonProducts = () => {
  return [...mockProducts]
    .sort((a, b) => a.endTime.getTime() - b.endTime.getTime())
    .slice(0, 5);
};

export const getMostBidsProducts = () => {
  return [...mockProducts]
    .sort((a, b) => b.totalBids - a.totalBids)
    .slice(0, 5);
};

export const getHighestPriceProducts = () => {
  return [...mockProducts]
    .sort((a, b) => b.currentBid - a.currentBid)
    .slice(0, 5);
};
