"use client";

import { DropdownMenu } from "@/components/ui/common/DropdownMenu";
import { getStatisticsOverview } from "@/services";
import {
  AdminStatisticsOverviewResponse,
  CategoryRevenueItem,
  TimePeriod,
} from "@/types";
import { formatPrice } from "@/utils/price";
import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import {
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { ImHammer2 } from "react-icons/im";
import { toast } from "react-toastify";
import { CategoryRevenueBarChart } from "./CategoryRevenueBarChart";
import { CategoryRevenuePieChart } from "./CategoryRevenuePieChart";
import { LeaderboardCard } from "./LeaderboardCard";
import { PendingPaymentsCard } from "./PendingPaymentsCard";
import { StatCard } from "./StatCard";

const TIME_PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: "LAST_7_DAYS", label: "7 ngày qua" },
  { value: "LAST_30_DAYS", label: "30 ngày qua" },
  { value: "LAST_YEAR", label: "Năm qua" },
  { value: "ALL_TIME", label: "Toàn bộ" },
];

export const StatisticsSection = () => {
  const [stats, setStats] = useState<AdminStatisticsOverviewResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("LAST_30_DAYS");

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await getStatisticsOverview({
        timePeriod,
        leaderboardLimit: 10,
      });
      setStats(data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [timePeriod]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-lg bg-white py-12 text-center">
        <p className="text-gray-500">Không có dữ liệu thống kê</p>
      </div>
    );
  }

  const {
    basicStatistics,
    totalRevenue,
    categoryRevenue,
    pendingPayments,
    topBidders,
    topSellers,
  } = stats;

  // Prepare data for charts
  const categoryChartData = categoryRevenue.map((cat: CategoryRevenueItem) => ({
    name: cat.categoryName,
    revenue: cat.totalRevenueCents,
    products: cat.productCount,
  }));

  const categoryPieData = categoryRevenue
    .slice(0, 5)
    .map((cat: CategoryRevenueItem) => ({
      name: cat.categoryName,
      value: cat.totalRevenueCents,
    }));

  return (
    <div>
      {/* Header with Time Period Selector */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Thống kê hệ thống</h2>
        <DropdownMenu
          value={timePeriod}
          options={TIME_PERIOD_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          onChange={(val) => setTimePeriod(val as TimePeriod)}
        />
      </div>

      {/* Basic Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FiPackage />}
          label="Sản phẩm mới"
          value={basicStatistics.newAuctionListings.toLocaleString("vi-VN")}
          description="Đấu giá mới"
          colorScheme="blue"
        />

        <StatCard
          icon={<FiUsers />}
          label="Người dùng mới"
          value={basicStatistics.newUsers.toLocaleString("vi-VN")}
          description="Đăng ký mới"
          colorScheme="green"
        />

        <StatCard
          icon={<FiTrendingUp />}
          label="Nâng cấp"
          value={basicStatistics.newSellerUpgrades.toLocaleString("vi-VN")}
          description="Seller mới"
          colorScheme="purple"
        />

        <StatCard
          icon={<FiShoppingBag />}
          label="Chưa có bid"
          value={basicStatistics.zeroBidProducts.toLocaleString("vi-VN")}
          description="Sản phẩm"
          colorScheme="red"
        />
      </div>

      {/* Revenue Statistics Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={<FiTrendingUp />}
          label="Tổng doanh thu"
          value={formatPrice(totalRevenue.totalRevenueCents)}
          description={totalRevenue.currency}
          colorScheme="green"
        />

        <StatCard
          icon={<FiShoppingBag />}
          label="Đơn hàng hoàn thành"
          value={totalRevenue.completedOrderCount.toLocaleString("vi-VN")}
          description="Đơn hàng"
          colorScheme="blue"
        />

        <StatCard
          icon={<FiTrendingUp />}
          label="Giá trị đơn trung bình"
          value={formatPrice(totalRevenue.averageOrderValueCents)}
          description="Trên mỗi đơn hàng"
          colorScheme="purple"
        />
      </div>

      {/* Pending Payments Info */}
      <div className="mb-8">
        <PendingPaymentsCard data={pendingPayments} />
      </div>

      {/* Category Revenue Charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <FiTrendingUp className="text-green-600" />
            Doanh thu theo danh mục
          </h3>
          <CategoryRevenueBarChart data={categoryChartData} />
        </div>

        {/* Pie Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <FiShoppingBag className="text-blue-600" />
            Top 5 danh mục
          </h3>
          <CategoryRevenuePieChart data={categoryPieData} />
        </div>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LeaderboardCard
          title="Top người mua"
          icon={<ImHammer2 className="text-yellow-500" />}
          data={topBidders}
          countLabel={(count) => `${count} lần đấu`}
        />

        <LeaderboardCard
          title="Top người bán"
          icon={<FaTrophy className="text-yellow-600" />}
          data={topSellers}
          countLabel={(count) => `${count} sản phẩm`}
        />
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Ghi chú:</strong> Tải lại trang để cập nhật dữ liệu thống kê
          mới nhất.
        </p>
      </div>
    </div>
  );
};
