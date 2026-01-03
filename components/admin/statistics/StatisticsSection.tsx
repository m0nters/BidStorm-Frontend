"use client";

import { getRevenueStatistics } from "@/services";
import { RevenueStatisticsResponse } from "@/types";
import { formatPrice } from "@/utils/price";
import { useEffect, useState } from "react";
import { FiDollarSign, FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import { toast } from "react-toastify";

export const StatisticsSection = () => {
  const [stats, setStats] = useState<RevenueStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await getRevenueStatistics();
      setStats(data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

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

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Thống kê doanh thu</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Revenue */}
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
            {formatPrice(stats.totalRevenueCents)}
          </p>
          <p className="mt-1 text-sm text-gray-500">{stats.currency}</p>
        </div>

        {/* Completed Orders */}
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
            {stats.completedOrderCount.toLocaleString("vi-VN")}
          </p>
          <p className="mt-1 text-sm text-gray-500">Đơn hàng</p>
        </div>

        {/* Average Order Value */}
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
            {formatPrice(stats.averageOrderValueCents)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Trên mỗi đơn hàng</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Lưu ý:</strong> Thống kê được tính dựa trên tất cả các đơn
          hàng đã hoàn thành trong hệ thống.
        </p>
      </div>
    </div>
  );
};
