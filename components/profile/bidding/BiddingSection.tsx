"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiddingActiveTab } from "./BiddingActiveTab";
import { BiddingWonTab } from "./BiddingWonTab";

type BiddingTabType = "dang-dau-gia" | "da-thang";

export function BiddingSection() {
  const router = useRouter();
  const pathname = usePathname();
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
    router.push(`/tai-khoan?tab=san-pham-dau-gia&sub=${tab}`);
  };

  useEffect(() => {
    if (!searchParams.has("sub")) {
      router.replace(`${pathname}?tab=san-pham-dau-gia&sub=dang-dau-gia`);
    }
  }, [searchParams, router, pathname]);

  return (
    <div>
      {/* Tabs */}
      <div className="relative mb-6 flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => handleTabChange("dang-dau-gia")}
          className={`cursor-pointer px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === "dang-dau-gia"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Đang đấu giá
        </button>
        <button
          onClick={() => handleTabChange("da-thang")}
          className={`cursor-pointer px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === "da-thang"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Đã thắng
        </button>
        <div
          className={`absolute bottom-0 h-0.5 bg-black transition-all duration-200 ${activeTab === "dang-dau-gia" ? "left-0 w-32" : "left-36 w-25"}`}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "dang-dau-gia" ? <BiddingActiveTab /> : <BiddingWonTab />}
    </div>
  );
}
