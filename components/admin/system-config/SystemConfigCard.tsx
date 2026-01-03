"use client";

import { SystemConfigResponse } from "@/types";
import { formatFullDateTime } from "@/utils/dateTime";
import { useState } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

interface Props {
  config: SystemConfigResponse;
  onSave: (key: string, value: string) => Promise<void>;
}

export const SystemConfigCard = ({ config, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(config.value);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(config.value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(config.value);
  };

  const handleSave = async () => {
    await onSave(config.key, editValue);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-bold">{config.description}</h3>

          <p className="text-xs text-gray-500">
            Key:{" "}
            <code className="rounded bg-gray-100 px-2 py-1">{config.key}</code>
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100"
            title="Chỉnh sửa"
          >
            <FiEdit2 className="text-blue-600" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="Nhập giá trị mới"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
            >
              <FiSave />
              Lưu
            </button>
            <button
              onClick={handleCancel}
              className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-gray-50"
            >
              <FiX />
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Giá trị hiện tại
            </label>
            <p className="mt-1 text-2xl font-bold">{config.value}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Cập nhật lần cuối
            </label>
            <p className="mt-1 text-sm text-gray-600">
              {formatFullDateTime(config.updatedAt)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
