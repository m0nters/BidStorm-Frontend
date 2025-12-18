"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiddingActiveTab } from "./BiddingActiveTab";
import { BiddingWonTab } from "./BiddingWonTab";

type BiddingTabType = "dang-dau-gia" | "da-thang";

export function BiddingSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<BiddingTabType>("dang-dau-gia");

  // Sync sub-tab with URL on mount and URL changes
  useEffect(() => {
    const subTab = searchParams.get("sub") as BiddingTabType | null;
    if (subTab && ["dang-dau-gia", "da-thang"].includes(subTab)) {
      setActiveTab(subTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: BiddingTabType) => {
    setActiveTab(tab);
    router.push(`/tai-khoan?tab=dau-gia&sub=${tab}`);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => handleTabChange("dang-dau-gia")}
          className={`relative cursor-pointer px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === "dang-dau-gia"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Đang đấu giá
          {activeTab === "dang-dau-gia" && (
            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-black"></div>
          )}
        </button>
        <button
          onClick={() => handleTabChange("da-thang")}
          className={`relative cursor-pointer px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === "da-thang"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Đã thắng
          {activeTab === "da-thang" && (
            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-black"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "dang-dau-gia" ? <BiddingActiveTab /> : <BiddingWonTab />}
    </div>
  );
}
