import {
  getTopEndingSoonProducts,
  getTopHighestPriceProducts,
  getTopMostBidsProducts,
} from "@/api";
import { Hero, ProductSection } from "@/components/ui";
import { FiClock, FiDollarSign, FiTrendingUp } from "react-icons/fi";

export default async function Home() {
  // Fetch all product sections in parallel
  const [endingSoonProducts, mostBidsProducts, highestPriceProducts] =
    await Promise.all([
      getTopEndingSoonProducts(),
      getTopMostBidsProducts(),
      getTopHighestPriceProducts(),
    ]);

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Ending Soon Section */}
      <ProductSection
        title="Sắp kết thúc"
        description="Đừng bỏ lỡ những phiên đấu giá sắp đóng trong vài giờ tới"
        products={endingSoonProducts}
        icon={<FiClock className="h-8 w-8" />}
      />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200" />
      </div>

      {/* Most Bids Section */}
      <ProductSection
        title="Phổ biến nhất"
        description="Sản phẩm có số lượt đấu giá cao nhất"
        products={mostBidsProducts}
        icon={<FiTrendingUp className="h-8 w-8" />}
      />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200" />
      </div>

      {/* Highest Price Section */}
      <ProductSection
        title="Đấu giá cao cấp"
        description="Sản phẩm có giá trị cao thu hút người đấu giá hàng đầu"
        products={highestPriceProducts}
        icon={<FiDollarSign className="h-8 w-8" />}
      />
    </div>
  );
}
