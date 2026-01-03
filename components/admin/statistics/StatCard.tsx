import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  description: string;
  colorScheme: "blue" | "green" | "purple" | "red";
}

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
};

export const StatCard = ({
  icon,
  label,
  value,
  description,
  colorScheme,
}: StatCardProps) => {
  const colors = colorClasses[colorScheme];

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-2 flex items-center gap-3">
        <div className={`rounded-lg ${colors.bg} p-3`}>
          <div className={`text-2xl ${colors.text}`}>{icon}</div>
        </div>
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
      </div>
      <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
};
