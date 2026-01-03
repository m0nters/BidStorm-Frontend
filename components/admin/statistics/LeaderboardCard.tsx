import { LeaderboardUser } from "@/types";
import { LeaderboardItem } from "./LeaderboardItem";

interface LeaderboardCardProps {
  title: string;
  data: LeaderboardUser[];
  countLabel: (count: number) => string;
}

export const LeaderboardCard = ({
  title,
  data,
  countLabel,
}: LeaderboardCardProps) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold">{title}</h3>
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
