"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewsGivenTab } from "./ReviewsGivenTab";
import { ReviewsReceivedTab } from "./ReviewsReceivedTab";

type ReviewsTabType = "cua-ban" | "nhan-duoc";

export function ReviewsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ReviewsTabType>("cua-ban");

  // Sync sub-tab with URL on mount and URL changes
  useEffect(() => {
    const subTab = searchParams.get("sub") as ReviewsTabType | null;
    if (subTab && ["cua-ban", "nhan-duoc"].includes(subTab)) {
      setActiveTab(subTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: ReviewsTabType) => {
    setActiveTab(tab);
    router.push(`/tai-khoan?tab=danh-gia&sub=${tab}`);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => handleTabChange("cua-ban")}
          className={`relative cursor-pointer px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === "cua-ban"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Đánh giá của bạn
          {activeTab === "cua-ban" && (
            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-black"></div>
          )}
        </button>
        <button
          onClick={() => handleTabChange("nhan-duoc")}
          className={`relative cursor-pointer px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === "nhan-duoc"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Đánh giá nhận được
          {activeTab === "nhan-duoc" && (
            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-black"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "cua-ban" ? <ReviewsGivenTab /> : <ReviewsReceivedTab />}
    </div>
  );
}
