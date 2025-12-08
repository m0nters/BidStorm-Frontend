"use client";

import { useEffect, useState } from "react";

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

const defaultCategories: CookieCategory[] = [
  {
    id: "necessary",
    name: "Cookie Cần thiết",
    description:
      "Các cookie này là thiết yếu để trang web hoạt động và không thể tắt. Chúng thường chỉ được đặt để đáp ứng các hành động do bạn thực hiện như đăng nhập, đặt tùy chọn bảo mật hoặc điền vào biểu mẫu.",
    required: true,
    enabled: true,
  },
  {
    id: "analytics",
    name: "Cookie Phân tích",
    description:
      "Các cookie này giúp chúng tôi hiểu cách khách truy cập tương tác với trang web bằng cách thu thập và báo cáo thông tin ẩn danh. Điều này giúp chúng tôi cải thiện hiệu suất và trải nghiệm người dùng của trang web.",
    required: false,
    enabled: true,
  },
  {
    id: "functional",
    name: "Cookie Chức năng",
    description:
      "Các cookie này cho phép trang web cung cấp chức năng nâng cao và cá nhân hóa như nhớ ngôn ngữ ưa thích của bạn, khu vực, hoặc các tùy chỉnh khác bạn đã thực hiện trên trang web.",
    required: false,
    enabled: true,
  },
  {
    id: "marketing",
    name: "Cookie Marketing",
    description:
      "Các cookie này được sử dụng để theo dõi khách truy cập trên các trang web để hiển thị quảng cáo phù hợp và hấp dẫn cho người dùng cá nhân. Chúng cũng được sử dụng để giới hạn số lần bạn nhìn thấy một quảng cáo và đo lường hiệu quả của chiến dịch quảng cáo.",
    required: false,
    enabled: false,
  },
];

export default function CookiePreferences() {
  const [categories, setCategories] =
    useState<CookieCategory[]>(defaultCategories);
  const [showToast, setShowToast] = useState(false);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem("cookiePreferences");
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences) as CookieCategory[];
        // Merge saved preferences with default categories to handle new categories
        const merged = defaultCategories.map((defaultCat) => {
          const saved = parsed.find((p) => p.id === defaultCat.id);
          return saved ? { ...defaultCat, enabled: saved.enabled } : defaultCat;
        });
        setCategories(merged);
      }
    } catch (error) {
      console.error("Failed to load cookie preferences:", error);
    }
  }, []);

  const toggleCategory = (id: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id && !cat.required
          ? { ...cat, enabled: !cat.enabled }
          : cat,
      ),
    );
  };

  const acceptAll = () => {
    setCategories(categories.map((cat) => ({ ...cat, enabled: true })));
    savePreferences(categories.map((cat) => ({ ...cat, enabled: true })));
  };

  const acceptNecessary = () => {
    setCategories(categories.map((cat) => ({ ...cat, enabled: cat.required })));
    savePreferences(
      categories.map((cat) => ({ ...cat, enabled: cat.required })),
    );
  };

  const savePreferences = (prefs: CookieCategory[]) => {
    // Save to localStorage
    localStorage.setItem("cookiePreferences", JSON.stringify(prefs));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSavePreferences = () => {
    savePreferences(categories);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="animate-in slide-in-from-top fixed top-4 right-4 z-50">
          <div className="rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Tùy chọn của bạn đã được lưu!</span>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Panel */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6">
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            Quản lý tùy chọn Cookie
          </h3>
          <p className="text-gray-600">
            Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn trên trang
            web. Bạn có thể tùy chỉnh cài đặt cookie của mình bên dưới.
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h4>
                    {category.required && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        Bắt buộc
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {category.description}
                  </p>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    disabled={category.required}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                      category.enabled ? "bg-blue-600" : "bg-gray-300"
                    } ${category.required ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    aria-label={`Toggle ${category.name}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                        category.enabled ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={acceptAll}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Chấp nhận tất cả
          </button>
          <button
            onClick={handleSavePreferences}
            className="flex-1 rounded-lg border-2 border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Lưu tùy chọn
          </button>
          <button
            onClick={acceptNecessary}
            className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            Chỉ cần thiết
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Bạn có thể thay đổi tùy chọn của mình bất kỳ lúc nào bằng cách quay
          lại trang này.
        </p>
      </div>
    </div>
  );
}
