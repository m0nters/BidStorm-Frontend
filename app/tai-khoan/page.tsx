"use client";

import { AuthenticatedLayout, RoleGuard } from "@/components/auth";
import {
  BiddingSection,
  ChangePasswordSection,
  FavoritesSection,
  ProfileInfoSection,
  ReviewsSection,
  SellerProductsSection,
  UpgradeRequestSection,
} from "@/components/profile/";
import { AvatarUpload } from "@/components/ui/common";
import { logout } from "@/services/auth";
import { deleteAvatar, getProfile, uploadAvatar } from "@/services/profile";
import { useAuthStore } from "@/store/authStore";
import { UserProfileResponse } from "@/types/profile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiHeart,
  FiLock,
  FiLogOut,
  FiPackage,
  FiStar,
  FiTrendingUp,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

type TabType =
  | "thong-tin"
  | "doi-mat-khau"
  | "yeu-thich"
  | "san-pham-dau-gia"
  | "danh-gia"
  | "san-pham-dang-ban"
  | "nang-cap-tai-khoan";

export default function ProfilePage() {
  return (
    <AuthenticatedLayout>
      <ProfilePageContent />
    </AuthenticatedLayout>
  );
}

function ProfilePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [activeTab, setActiveTab] = useState<TabType>("thong-tin");
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync tab with URL on mount and URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType | null;
    if (
      tabParam &&
      [
        "thong-tin",
        "doi-mat-khau",
        "yeu-thich",
        "san-pham-dau-gia",
        "danh-gia",
        "san-pham-dang-ban",
        "nang-cap-tai-khoan",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!searchParams.has("tab")) {
      router.replace(`${pathname}?tab=thong-tin`);
    }
  }, [searchParams, router, pathname]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      clearAuth();
      router.push("/");
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const updatedProfile = await uploadAvatar(file);
    setProfile(updatedProfile);
  };

  const handleAvatarDelete = async () => {
    const updatedProfile = await deleteAvatar();
    setProfile(updatedProfile);
  };

  const tabs = [
    { id: "thong-tin", label: "Thông tin cá nhân", icon: FiUser },
    { id: "doi-mat-khau", label: "Đổi mật khẩu", icon: FiLock },
    { id: "yeu-thich", label: "Sản phẩm yêu thích", icon: FiHeart },
    { id: "san-pham-dau-gia", label: "Sản phẩm đấu giá", icon: FiTrendingUp },
    ...(profile?.role === "SELLER" || profile?.role === "ADMIN"
      ? [
          {
            id: "san-pham-dang-ban",
            label: "Sản phẩm đăng bán",
            icon: FiPackage,
          },
        ]
      : []),
    { id: "danh-gia", label: "Đánh giá của tôi", icon: FiStar },
    ...(profile?.role === "BIDDER"
      ? [
          {
            id: "nang-cap-tai-khoan",
            label: "Nâng cấp tài khoản",
            icon: FiTrendingUp,
          },
        ]
      : []),
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    router.push(`/tai-khoan?tab=${tabId}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Tài khoản</h1>
          <p className="mt-2 text-gray-600">
            Quản lý thông tin cá nhân và hoạt động của bạn
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* User Profile */}
              <div className="mb-6 text-center">
                {profile?.avatarUrl ? (
                  <AvatarUpload
                    avatarUrl={profile.avatarUrl}
                    userName={profile.fullName}
                    onUpload={handleAvatarUpload}
                    onDelete={handleAvatarDelete}
                    className="mx-auto mb-4"
                  />
                ) : (
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-black text-5xl font-bold text-white">
                    {profile?.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile?.fullName}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{profile?.email}</p>
                <div className="mt-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      profile?.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : profile?.role === "SELLER"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {profile?.role === "ADMIN"
                      ? "Quản trị viên"
                      : profile?.role === "SELLER"
                        ? "Người bán"
                        : "Người mua"}
                  </span>
                </div>

                {/* Rating Stats */}
                {profile && profile.totalRatings > 0 && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold text-gray-900">
                      <FiStar className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      {profile.ratingPercentage.toFixed(0)}%
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiCheckCircle className="h-3 w-3 text-green-600" />
                        {profile.positiveRating}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiXCircle className="h-3 w-3 text-red-600" />
                        {profile.negativeRating}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {profile.totalRatings} đánh giá
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as TabType)}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              {activeTab === "thong-tin" && (
                <ProfileInfoSection
                  profile={profile}
                  onProfileUpdate={loadProfile}
                />
              )}
              {activeTab === "doi-mat-khau" && <ChangePasswordSection />}
              {activeTab === "yeu-thich" && <FavoritesSection />}
              {activeTab === "san-pham-dau-gia" && <BiddingSection />}
              {activeTab === "san-pham-dang-ban" && (
                <RoleGuard allowedRoles={["SELLER"]}>
                  <SellerProductsSection />
                </RoleGuard>
              )}
              {activeTab === "danh-gia" && <ReviewsSection />}
              {activeTab === "nang-cap-tai-khoan" && (
                <RoleGuard allowedRoles={["BIDDER"]}>
                  <UpgradeRequestSection />
                </RoleGuard>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
