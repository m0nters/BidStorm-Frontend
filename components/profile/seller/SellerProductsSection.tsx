"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SellerActiveTab } from "./SellerActiveTab";
import { SellerEndedTab } from "./SellerEndedTab";

type SellerProductTabType = "dang-dang" | "da-ket-thuc";

export function SellerProductsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SellerProductTabType>("dang-dang");

  // Sync sub-tab with URL on mount and URL changes
  useEffect(() => {
    const subTab = searchParams.get("sub") as SellerProductTabType | null;
    if (subTab && ["dang-dang", "da-ket-thuc"].includes(subTab)) {
      setActiveTab(subTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: SellerProductTabType) => {
    setActiveTab(tab);
    router.push(`/tai-khoan?tab=san-pham-dang-ban&sub=${tab}`);
  };

  useEffect(() => {
    if (!searchParams.has("sub")) {
      router.replace(`${pathname}?tab=san-pham-dang-ban&sub=dang-dang`);
    }
  }, [searchParams, router, pathname]);

  return (
    <div>
      {/* Tabs */}
      <div className="relative mb-6 flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => handleTabChange("dang-dang")}
          className={`cursor-pointer px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === "dang-dang"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Đang đăng
        </button>
        <button
          onClick={() => handleTabChange("da-ket-thuc")}
          className={`cursor-pointer px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === "da-ket-thuc"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Đã kết thúc
        </button>
        <div
          className={`absolute bottom-0 h-0.5 bg-black transition-all duration-200 ${activeTab === "dang-dang" ? "left-0 w-28" : "left-32 w-[116px]"}`}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "dang-dang" ? <SellerActiveTab /> : <SellerEndedTab />}
    </div>
  );
}
