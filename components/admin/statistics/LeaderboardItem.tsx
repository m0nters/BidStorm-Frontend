import { formatPrice } from "@/utils/price";

interface LeaderboardItemProps {
  index: number;
  name: string;
  email: string;
  value: number;
  count: number;
  countLabel: string;
}

export const LeaderboardItem = ({
  index,
  name,
  email,
  value,
  count,
  countLabel,
}: LeaderboardItemProps) => {
  const getRankColorClass = (rank: number) => {
    switch (rank) {
      case 0:
        return "bg-yellow-100 text-yellow-700";
      case 1:
        return "bg-gray-100 text-gray-700";
      case 2:
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-blue-50 text-blue-600";
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${getRankColorClass(index)}`}
        >
          {index + 1}
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-green-600">{formatPrice(value)}</p>
        <p className="text-sm text-gray-500">{countLabel}</p>
      </div>
    </div>
  );
};
