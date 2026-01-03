"use client";

import { DropdownMenu } from "@/components/ui/common/DropdownMenu";
import { getStatisticsOverview } from "@/services";
import {
  AdminStatisticsOverviewResponse,
  CategoryRevenueItem,
  TimePeriod,
} from "@/types";
import { getColorForIndex } from "@/utils/colorGenerator";
import { formatPrice } from "@/utils/price";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <FiPackage className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Sản phẩm mới</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {basicStatistics.newAuctionListings.toLocaleString("vi-VN")}
          </p>
          <p className="mt-1 text-sm text-gray-500">Đấu giá mới</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3">
              <FiUsers className="text-2xl text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Người dùng mới
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {basicStatistics.newUsers.toLocaleString("vi-VN")}
          </p>
          <p className="mt-1 text-sm text-gray-500">Đăng ký mới</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3">
              <FiTrendingUp className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Nâng cấp</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {basicStatistics.newSellerUpgrades.toLocaleString("vi-VN")}
          </p>
          <p className="mt-1 text-sm text-gray-500">Seller mới</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-3">
              <FiActivity className="text-2xl text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Chưa có bid</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {basicStatistics.zeroBidProducts.toLocaleString("vi-VN")}
          </p>
          <p className="mt-1 text-sm text-gray-500">Sản phẩm</p>
        </div>
      </div>

      {/* Revenue Statistics Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3">
              <FiDollarSign className="text-2xl text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Tổng doanh thu
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatPrice(totalRevenue.totalRevenueCents)}
          </p>
          <p className="mt-1 text-sm text-gray-500">{totalRevenue.currency}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <FiShoppingBag className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Đơn hàng hoàn thành
            </h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {totalRevenue.completedOrderCount.toLocaleString("vi-VN")}
          </p>
          <p className="mt-1 text-sm text-gray-500">Đơn hàng</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3">
              <FiTrendingUp className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Giá trị đơn trung bình
            </h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {formatPrice(totalRevenue.averageOrderValueCents)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Trên mỗi đơn hàng</p>
        </div>
      </div>

      {/* Pending Payments Info */}
      <div className="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-orange-100 p-3">
            <FiClock className="text-2xl text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-bold text-orange-900">
              Thanh toán đang chờ
            </h3>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-orange-700">Tổng giá trị</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatPrice(pendingPayments.totalPendingCents)}
                </p>
              </div>
              <div>
                <p className="text-sm text-orange-700">Số đơn hàng</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingPayments.orderCount.toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-orange-700">Loại tiền tệ</p>
                <p className="text-xl font-semibold text-orange-600">
                  {pendingPayments.currency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Revenue Charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <FiDollarSign className="text-green-600" />
            Doanh thu theo danh mục
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const vnd = value;
                  if (vnd >= 1000000000)
                    return `${(vnd / 1000000000).toFixed(1)}Tỷ`;
                  if (vnd >= 1000000) return `${(vnd / 1000000).toFixed(0)}M`;
                  if (vnd >= 1000) return `${(vnd / 1000).toFixed(0)}K`;
                  return vnd.toFixed(0);
                }}
              />
              <Tooltip
                formatter={(value: any) => [formatPrice(value), "Doanh thu"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="revenue" fill="#000000" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <FiShoppingBag className="text-blue-600" />
            Top 5 danh mục
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.name}
                labelLine={true}
              >
                {categoryPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorForIndex(index, categoryPieData.length)}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => formatPrice(value)}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Bidders */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">🏆 Top người mua</h3>
          {topBidders.length === 0 ? (
            <p className="py-8 text-center text-gray-500">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {topBidders.map((bidder, index) => (
                <div
                  key={bidder.userId}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                            ? "bg-gray-100 text-gray-700"
                            : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{bidder.fullName}</p>
                      <p className="text-sm text-gray-500">{bidder.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatPrice(bidder.valueCents)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {bidder.count} lần đấu
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Sellers */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">⭐ Top người bán</h3>
          {topSellers.length === 0 ? (
            <p className="py-8 text-center text-gray-500">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {topSellers.map((seller, index) => (
                <div
                  key={seller.userId}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                            ? "bg-gray-100 text-gray-700"
                            : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{seller.fullName}</p>
                      <p className="text-sm text-gray-500">{seller.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatPrice(seller.valueCents)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {seller.count} sản phẩm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Thời kỳ hiển thị:</strong>{" "}
          {TIME_PERIOD_OPTIONS.find((o) => o.value === timePeriod)?.label}
          {" • "}
          <strong>Lưu ý:</strong> Thống kê được cập nhật theo thời gian thực dựa
          trên dữ liệu hệ thống.
        </p>
      </div>
    </div>
  );
};
