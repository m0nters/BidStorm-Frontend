"use client";

import { listSystemConfigs, updateSystemConfig } from "@/services";
import { SystemConfigResponse } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SystemConfigCard } from "./SystemConfigCard";

export const SystemConfigSection = () => {
  const [configs, setConfigs] = useState<SystemConfigResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data = await listSystemConfigs();
      setConfigs(data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải cấu hình hệ thống");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSave = async (key: string, value: string) => {
    try {
      await updateSystemConfig(key, { value });
      toast.success("Cập nhật cấu hình thành công");
      await fetchConfigs();
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật cấu hình");
      throw error;
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Cấu hình hệ thống</h2>

      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-black"></div>
        </div>
      ) : configs.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center">
          <p className="text-gray-500">Không có cấu hình nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {configs.map((config) => (
            <SystemConfigCard
              key={config.key}
              config={config}
              onSave={handleSave}
            />
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          <strong>Cảnh báo:</strong> Thay đổi các cấu hình hệ thống có thể ảnh
          hưởng đến hoạt động của toàn bộ nền tảng. Vui lòng kiểm tra kỹ trước
          khi lưu.
        </p>
      </div>
    </div>
  );
};
