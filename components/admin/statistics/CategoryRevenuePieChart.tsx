"use client";

import { getColorForIndex } from "@/utils/colorGenerator";
import { formatPrice } from "@/utils/price";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface CategoryRevenuePieChartProps {
  data: CategoryData[];
}

export const CategoryRevenuePieChart = ({
  data,
}: CategoryRevenuePieChartProps) => {
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;

    // Calculate percentage
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((value / total) * 100).toFixed(1);

    // Only show label if percentage is >= 5%
    if (parseFloat(percentage) < 5) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props) => renderCustomLabel(props)}
            outerRadius={100}
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColorForIndex(index, data.length)}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as CategoryData;
                const total = data.reduce((sum, d) => sum + d.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Doanh thu:{" "}
                      <span className="text-sm font-medium">
                        {formatPrice(item.value)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Tỷ lệ:{" "}
                      <span className="text-sm font-medium">{percentage}%</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-gray-100 pt-4">
        {data.map((item, index) => {
          const total = data.reduce((sum, d) => sum + d.value, 0);
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div
              key={`legend-${index}`}
              className="flex items-center space-x-1"
              title={`${item.name}: ${percentage}%`}
            >
              <div
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{
                  backgroundColor: getColorForIndex(index, data.length),
                }}
              />
              <span className="text-xs text-gray-700">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
