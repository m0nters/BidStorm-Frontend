import { LeaderboardUser } from "@/types";
import { ReactNode } from "react";
import { LeaderboardItem } from "./LeaderboardItem";

interface LeaderboardCardProps {
  title: string;
  icon: ReactNode;
  data: LeaderboardUser[];
  countLabel: (count: number) => string;
}

export const LeaderboardCard = ({
  title,
  icon,
  data,
  countLabel,
}: LeaderboardCardProps) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        {icon}
        {title}
      </h3>
      {data.length === 0 ? (
        <p className="py-8 text-center text-gray-500">Chưa có dữ liệu</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <LeaderboardItem
              key={item.userId}
              index={index}
              name={item.fullName}
              email={item.email}
              value={item.valueCents}
              count={item.count}
              countLabel={countLabel(item.count)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
