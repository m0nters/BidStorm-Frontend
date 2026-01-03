import { PendingPaymentsInfo } from "@/types";
import { formatPrice } from "@/utils/price";
import { FiClock } from "react-icons/fi";

interface PendingPaymentsCardProps {
  data: PendingPaymentsInfo;
}

export const PendingPaymentsCard = ({ data }: PendingPaymentsCardProps) => {
  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
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
                {formatPrice(data.totalPendingCents)}
              </p>
            </div>
            <div>
              <p className="text-sm text-orange-700">Số đơn hàng</p>
              <p className="text-2xl font-bold text-orange-600">
                {data.orderCount.toLocaleString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-sm text-orange-700">Loại tiền tệ</p>
              <p className="text-xl font-semibold text-orange-600">
                {data.currency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
