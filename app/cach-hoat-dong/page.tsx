"use client";

import { PageHero } from "@/components/layout/";
import { SectionHeading } from "@/components/ui/common";
import Link from "next/link";
import {
  FiAward,
  FiCheckCircle,
  FiClock,
  FiDisc,
  FiDollarSign,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUserPlus,
} from "react-icons/fi";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Cách hoạt động"
        subtitle="Hướng dẫn đầy đủ để bắt đầu đấu giá trên BidStorm"
      />

      {/* Steps Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <SectionHeading
              id="buoc-bat-dau"
              className="text-4xl font-bold text-gray-900"
            >
              4 bước đơn giản để bắt đầu
            </SectionHeading>
            <p className="mt-4 text-lg text-gray-600">
              Tham gia đấu giá chỉ trong vài phút
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="group relative">
              <div className="absolute -top-4 -left-4 text-8xl font-bold text-gray-100">
                01
              </div>
              <div className="relative rounded-2xl border-2 border-gray-200 bg-white p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
                <div className="mb-4 inline-flex rounded-full bg-black p-4">
                  <FiUserPlus className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Đăng ký tài khoản
                </h3>
                <p className="text-gray-600">
                  Tạo tài khoản miễn phí chỉ với email và số điện thoại. Xác
                  thực danh tính để đảm bảo an toàn cho mọi giao dịch.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              <div className="absolute -top-4 -left-4 text-8xl font-bold text-gray-100">
                02
              </div>
              <div className="relative rounded-2xl border-2 border-gray-200 bg-white p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
                <div className="mb-4 inline-flex rounded-full bg-black p-4">
                  <FiSearch className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Tìm sản phẩm
                </h3>
                <p className="text-gray-600">
                  Duyệt qua hàng nghìn sản phẩm từ điện tử, thời trang đến đồ
                  sưu tầm. Sử dụng bộ lọc để tìm chính xác thứ bạn cần.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="absolute -top-4 -left-4 text-8xl font-bold text-gray-100">
                03
              </div>
              <div className="relative rounded-2xl border-2 border-gray-200 bg-white p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
                <div className="mb-4 inline-flex rounded-full bg-black p-4">
                  <FiDollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Đặt giá tối đa
                </h3>
                <p className="text-gray-600">
                  Đặt mức giá tối đa bạn sẵn sàng trả. Hệ thống tự động đấu giá
                  thay bạn với giá thấp nhất có thể để thắng cuộc.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group relative">
              <div className="absolute -top-4 -left-4 text-8xl font-bold text-gray-100">
                04
              </div>
              <div className="relative rounded-2xl border-2 border-gray-200 bg-white p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
                <div className="mb-4 inline-flex rounded-full bg-black p-4">
                  <FiAward className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Giành chiến thắng
                </h3>
                <p className="text-gray-600">
                  Nếu bạn thắng, thanh toán an toàn và nhận sản phẩm. Đánh giá
                  người bán để xây dựng cộng đồng uy tín.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <SectionHeading
              id="tinh-nang-noi-bat"
              className="text-4xl font-bold text-gray-900"
            >
              Tính năng nổi bật
            </SectionHeading>
            <p className="mt-4 text-lg text-gray-600">
              Những gì làm cho BidStorm khác biệt
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <FiShield className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Giao dịch an toàn
              </h3>
              <p className="text-gray-600">
                Hệ thống thanh toán được mã hóa và bảo vệ. Tiền được giữ an toàn
                cho đến khi giao dịch hoàn tất.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <FiClock className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Đấu giá 24/7
              </h3>
              <p className="text-gray-600">
                Tham gia đấu giá bất cứ lúc nào, bất cứ nơi đâu. Hệ thống tự
                động giúp bạn không bỏ lỡ cơ hội.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <FiTrendingUp className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Đấu giá tự động
              </h3>
              <p className="text-gray-600">
                Đặt giá tối đa một lần và hệ thống tự động đấu giá thay bạn. Bạn
                không cần theo dõi liên tục và vẫn có thể thắng với giá tối ưu.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <FiCheckCircle className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Xác thực người bán
              </h3>
              <p className="text-gray-600">
                Tất cả người bán đều được xác minh danh tính và đánh giá bởi
                cộng đồng.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <FiDollarSign className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Giá khởi điểm thấp
              </h3>
              <p className="text-gray-600">
                Nhiều sản phẩm chất lượng cao với giá khởi điểm chỉ từ 1.000đ.
                Cơ hội sở hữu deal tốt.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <FiAward className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Hỗ trợ 24/7
              </h3>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc và xử lý vấn đề
                của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bidding Types Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <SectionHeading
              id="tinh-nang"
              className="text-4xl font-bold text-gray-900"
            >
              Tính năng
            </SectionHeading>
            <p className="mt-4 text-lg text-gray-600">
              Các tính năng cốt lõi của hệ thống
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border-2 border-gray-200 p-8 transition-colors hover:border-blue-500">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900">
                Phổ biến nhất
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Đấu giá tự động
              </h3>
              <p className="mb-6 text-gray-600">
                Đặt mức giá tối đa bạn sẵn sàng trả. Hệ thống tự động đấu giá
                thay bạn để giành chiến thắng với giá thấp nhất có thể.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">
                    Không cần theo dõi liên tục
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">
                    Hệ thống đấu giá tự động
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Thắng với giá tối ưu</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-gray-200 p-8 transition-colors hover:border-purple-500">
              <div className="mb-4 inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-900">
                Nhanh chóng
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Mua ngay
              </h3>
              <p className="mb-6 text-gray-600">
                Không muốn chờ đợi? Mua ngay với giá cố định được người bán đặt
                sẵn và sở hữu sản phẩm ngay lập tức.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Không cần đấu giá</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Sở hữu ngay lập tức</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Giá cố định, rõ ràng</span>
                </li>
              </ul>
              <div className="mt-6 rounded-lg bg-purple-50 p-4">
                <p className="mb-2 text-sm font-semibold text-purple-900">
                  Ưu điểm:
                </p>
                <p className="text-sm text-purple-800">
                  Thanh toán ngay, nhận hàng nhanh. Không lo bị ai đấu giá cao
                  hơn hay phải chờ đợi kết thúc phiên đấu giá.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-gray-200 p-8 transition-colors hover:border-red-500">
              <div className="mb-4 inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-900">
                Tự động gia hạn
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Gia hạn thông minh
              </h3>
              <p className="mb-6 text-gray-600">
                Khi có lượt đấu giá mới trước khi kết thúc 5 phút, sản phẩm tự
                động gia hạn thêm 10 phút để đảm bảo công bằng.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Tự động gia hạn</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Công bằng tuyệt đối</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-gray-600">Tránh đấu giá phút chót</span>
                </li>
              </ul>
              <div className="mt-6 rounded-lg bg-red-50 p-4">
                <p className="mb-2 text-sm font-semibold text-red-900">
                  Lưu ý:
                </p>
                <p className="text-sm text-red-800">
                  Chỉ áp dụng cho sản phẩm người bán bật tùy chọn tự động gia
                  hạn. Đảm bảo mọi người có thời gian đấu giá công bằng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auto Bidding Detailed Explanation */}
      <section className="bg-linear-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <SectionHeading
              id="dau-gia-tu-dong"
              className="text-4xl font-bold text-gray-900"
            >
              Đấu giá tự động hoạt động như thế nào?
            </SectionHeading>
            <p className="mt-4 text-lg text-gray-600">
              Hiểu rõ cơ chế để tận dụng tối đa lợi thế của bạn
            </p>
          </div>

          {/* Key Concept */}
          <div className="mb-12 rounded-2xl bg-linear-to-br from-slate-700 to-slate-800 p-8 text-white shadow-xl">
            <h3 className="mb-4 text-2xl font-bold">Nguyên tắc cơ bản</h3>
            <p className="text-lg leading-relaxed">
              Bạn đặt <span className="font-bold underline">giá tối đa</span>{" "}
              bạn sẵn sàng trả cho sản phẩm. Hệ thống sẽ tự động đấu giá thay
              bạn, bắt đầu từ giá hiện tại và tăng dần theo bước giá cho đến
              khi:
            </p>
            <ul className="mt-4 space-y-2 text-lg">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-2xl">✓</span>
                <span>Bạn trở thành người đấu giá cao nhất</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-2xl">✓</span>
                <span>Hoặc đã đạt đến giá tối đa của bạn</span>
              </li>
            </ul>
          </div>

          {/* Step by Step Example */}
          <div className="mb-12">
            <h3 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Ví dụ thực tế
            </h3>
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8">
              <div className="mb-6 flex items-center gap-4 rounded-lg bg-gray-100 p-4">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold">Thông tin sản phẩm:</p>
                  <p>
                    Giá khởi điểm:{" "}
                    <span className="font-bold">10.000.000đ</span>
                  </p>
                  <p>
                    Bước giá: <span className="font-bold">100.000đ</span>
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Scenario 1 */}
                <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white">
                      Bước 1
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">
                      Bạn đặt giá tối đa: 11.000.000đ
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    Hệ thống sẽ đấu giá cho bạn với giá{" "}
                    <span className="font-bold">10.000.000đ</span> (giá khởi
                    điểm). Giá tối đa 11 triệu của bạn được{" "}
                    <span className="font-bold text-green-700">giữ bí mật</span>
                    .
                  </p>
                </div>

                {/* Scenario 2 */}
                <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-bold text-white">
                      Bước 2
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">
                      Người khác đấu: 10.500.000đ
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    Hệ thống tự động đấu{" "}
                    <span className="font-bold">10.600.000đ</span> cho bạn (giá
                    của người kia + 1 bước giá). Bạn vẫn đang thắng!
                  </p>
                </div>

                {/* Scenario 3 */}
                <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full bg-purple-500 px-3 py-1 text-sm font-bold text-white">
                      Bước 3
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">
                      Người khác đấu: 10.800.000đ
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    Hệ thống tự động đấu{" "}
                    <span className="font-bold">10.900.000đ</span> cho bạn. Bạn
                    vẫn chưa đạt giá tối đa nên vẫn đang thắng!
                  </p>
                </div>

                {/* Scenario 4 */}
                <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                      Bước 4
                    </span>
                    <h4 className="text-lg font-bold text-gray-900">
                      Người khác đấu giá tối đa: 12.000.000đ
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    Hệ thống cố gắng đấu cho bạn nhưng giá tối đa của bạn chỉ là
                    11 triệu. Giá hiện tại sẽ là{" "}
                    <span className="font-bold">11.000.000đ</span> (giá tối đa
                    của bạn), nhưng{" "}
                    <span className="font-bold text-red-700">
                      người kia đang thắng
                    </span>{" "}
                    vì có giá tối đa cao hơn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tie Breaking Rule */}
          <div className="mb-12 overflow-hidden rounded-xl bg-slate-200 shadow-lg">
            <div className="p-8">
              <h3 className="mb-6 flex items-center gap-4 text-2xl font-semibold text-slate-900">
                <FiClock className="h-10 w-10 text-slate-600" />
                Quy tắc phá vỡ hòa
              </h3>

              <p className="mb-6 text-lg leading-relaxed text-slate-700">
                Nếu hai người đặt{" "}
                <span className="font-semibold">cùng giá tối đa</span>, ai đặt
                trước sẽ thắng:
              </p>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <p className="mb-3 text-slate-700">
                  <span className="font-semibold">Ví dụ:</span> Bạn đặt 11 triệu
                  lúc 14:00. Người khác đặt 11 triệu lúc 14:05.
                </p>

                <p className="flex items-center gap-2 text-lg font-semibold text-green-700">
                  <FiCheckCircle className="h-6 w-6 shrink-0 text-green-700" />
                  Bạn thắng vì đặt trước!
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h4 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-900">
                <FiCheckCircle className="text-green-600" />
                Lợi ích cho bạn
              </h4>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-center gap-3">
                  <FiDisc className="h-4 w-4 shrink-0 text-slate-500" />
                  <span>Không cần theo dõi liên tục 24/7</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiDisc className="h-4 w-4 shrink-0 text-slate-500" />
                  <span>
                    Giá tối đa của bạn được giữ bí mật đối với người mua khác
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FiDisc className="h-4 w-4 shrink-0 text-slate-500" />
                  <span>Chỉ trả vừa đủ để thắng, không hơn</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiDisc className="h-4 w-4 shrink-0 text-slate-500" />
                  <span>Tiết kiệm thời gian và công sức</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
              <h4 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-900">
                <FiShield className="h-5 w-5 text-blue-600" />{" "}
                {/* Slightly smaller icon for balance */}
                Lưu ý quan trọng
              </h4>
              <ul className="space-y-3 text-gray-700">
                {" "}
                {/* Increased space-y for better breathing room */}
                <li className="flex items-center gap-3">
                  <FiDisc className="h-4 w-4 shrink-0 text-gray-500" />{" "}
                  {/* Solid dot, gray for subtlety */}
                  <span>Chỉ đặt giá tối đa bạn thực sự sẵn sàng trả</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiDisc className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>Bạn có thể tăng giá tối đa bất cứ lúc nào</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiDisc className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>Không thể giảm hoặc hủy sau khi đặt</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiDisc className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>
                    Chỉ người bán hoặc bạn mới có thể xem giá tối đa của mình
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-gray-900 to-black py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold">Sẵn sàng bắt đầu đấu giá?</h2>
          <p className="mb-8 text-xl text-gray-300">
            Tham gia cùng hàng nghìn người đấu giá thành công trên BidStorm
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dang-ky"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-100"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              href="/danh-muc"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
