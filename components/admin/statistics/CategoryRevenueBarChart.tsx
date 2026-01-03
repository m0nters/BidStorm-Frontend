import { formatPrice } from "@/utils/price";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryChartData {
  name: string;
  revenue: number;
  products: number;
}

interface CategoryRevenueBarChartProps {
  data: CategoryChartData[];
}

export const CategoryRevenueBarChart = ({
  data,
}: CategoryRevenueBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
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
            if (vnd >= 1000000000) return `${(vnd / 1000000000).toFixed(1)}Tỷ`;
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
  );
};
