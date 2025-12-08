import PageHero from "@/components/layout/PageHero";
import Link from "next/link";
import {
  FiAward,
  FiCheckCircle,
  FiClock,
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
            <h2 className="text-4xl font-bold text-gray-900">
              4 bước đơn giản để bắt đầu
            </h2>
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
            <h2 className="text-4xl font-bold text-gray-900">
              Tính năng nổi bật
            </h2>
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
            <h2 className="text-4xl font-bold text-gray-900">Tính năng</h2>
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
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="mb-2 text-sm font-semibold text-blue-900">
                  Cách hoạt động:
                </p>
                <p className="text-sm text-blue-800">
                  Bạn đặt giá tối đa là 11 triệu. Nếu người khác đặt 10.8 triệu,
                  hệ thống tự động đấu 10.9 triệu thay bạn (nếu bước giá là
                  100k). Bạn chỉ trả vừa đủ để thắng!
                </p>
              </div>
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
