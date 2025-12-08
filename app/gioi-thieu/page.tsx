import PageHero from "@/components/layout/PageHero";
import Link from "next/link";
import {
  FiAward,
  FiGlobe,
  FiHeart,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        title="Giới thiệu về BidStorm"
        subtitle="Nền tảng đấu giá trực tuyến hàng đầu Việt Nam"
      />

      {/* Story Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900">
                Câu chuyện của chúng tôi
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  BidStorm được thành lập vào năm 2025 bởi CEO Tài Trịnh với sứ
                  mệnh mang đến trải nghiệm đấu giá trực tuyến minh bạch, an
                  toàn và công bằng cho người dùng Việt Nam.
                </p>
                <p>
                  Chúng tôi tin rằng mọi người đều xứng đáng có cơ hội sở hữu
                  những sản phẩm chất lượng cao với giá trị tốt nhất. Từ đồ điện
                  tử, thời trang đến đồ sưu tầm độc đáo, BidStorm kết nối người
                  mua và người bán trong một môi trường đáng tin cậy.
                </p>
                <p>
                  Với công nghệ hiện đại và đội ngũ chuyên nghiệp, chúng tôi
                  không ngừng cải tiến để mang lại dịch vụ tốt nhất cho cộng
                  đồng.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 p-8">
                <div className="mb-4 text-4xl font-bold text-blue-900">
                  36,000+
                </div>
                <div className="text-lg font-semibold text-blue-800">
                  Phiên đấu giá thành công
                </div>
                <p className="mt-2 text-blue-700">
                  Hàng nghìn giao dịch được hoàn tất mỗi tháng
                </p>
              </div>

              <div className="rounded-2xl bg-linear-to-br from-green-50 to-green-100 p-8">
                <div className="mb-4 text-4xl font-bold text-green-900">
                  18,000+
                </div>
                <div className="text-lg font-semibold text-green-800">
                  Người dùng hài lòng
                </div>
                <p className="mt-2 text-green-700">
                  Cộng đồng đấu giá đang phát triển mạnh mẽ
                </p>
              </div>

              <div className="rounded-2xl bg-linear-to-br from-purple-50 to-purple-100 p-8">
                <div className="mb-4 text-4xl font-bold text-purple-900">
                  99%
                </div>
                <div className="text-lg font-semibold text-purple-800">
                  Tỷ lệ thành công
                </div>
                <p className="mt-2 text-purple-700">
                  Giao dịch an toàn và đáng tin cậy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-black p-4">
                <FiTarget className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Sứ mệnh</h3>
              <p className="text-gray-600">
                Tạo ra nền tảng đấu giá minh bạch, an toàn và dễ tiếp cận, nơi
                mọi người có thể mua bán sản phẩm với giá trị tốt nhất trong môi
                trường công bằng và đáng tin cậy.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-black p-4">
                <FiHeart className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Tầm nhìn
              </h3>
              <p className="text-gray-600">
                Trở thành nền tảng đấu giá trực tuyến hàng đầu Đông Nam Á, đặt
                tiêu chuẩn mới cho ngành công nghiệp với công nghệ tiên tiến và
                trải nghiệm người dùng xuất sắc.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-black p-4">
                <FiUsers className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Giá trị cốt lõi
              </h3>
              <p className="text-gray-600">
                Minh bạch trong mọi giao dịch, an toàn cho người dùng, công bằng
                trong cạnh tranh, và không ngừng đổi mới để phục vụ cộng đồng
                tốt hơn mỗi ngày.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Tại sao chọn BidStorm?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Những điều làm nên sự khác biệt của chúng tôi
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border-2 border-gray-200 p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
              <FiTrendingUp className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Công nghệ tiên tiến
              </h3>
              <p className="text-gray-600">
                Hệ thống đấu giá thời gian thực với công nghệ WebSocket, đảm bảo
                trải nghiệm mượt mà và chính xác.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-gray-200 p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
              <FiAward className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Đảm bảo chất lượng
              </h3>
              <p className="text-gray-600">
                Mọi sản phẩm và người bán đều được xác minh kỹ lưỡng trước khi
                đăng tải trên nền tảng.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-gray-200 p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
              <FiGlobe className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Cộng đồng lớn mạnh
              </h3>
              <p className="text-gray-600">
                Tham gia cùng hàng nghìn người đấu giá khắp Việt Nam trong môi
                trường an toàn và thân thiện.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-gray-200 p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
              <FiUsers className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Hỗ trợ tận tâm
              </h3>
              <p className="text-gray-600">
                Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ
                24/7 qua nhiều kênh liên lạc.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-gray-200 p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
              <FiTarget className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Minh bạch tuyệt đối
              </h3>
              <p className="text-gray-600">
                Lịch sử đấu giá, đánh giá người dùng và mọi thông tin đều công
                khai và có thể kiểm chứng.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-gray-200 p-8 transition-all duration-300 hover:border-black hover:shadow-xl">
              <FiHeart className="mb-4 h-12 w-12 text-black" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Trải nghiệm tốt nhất
              </h3>
              <p className="text-gray-600">
                Giao diện thân thiện, dễ sử dụng trên mọi thiết bị, từ máy tính
                đến điện thoại di động.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Đội ngũ của chúng tôi
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Những con người đầy nhiệt huyết đằng sau BidStorm
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Team Member A */}
            <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img
                  src="https://media.licdn.com/dms/image/v2/D5603AQGP4l1wL10pag/profile-displayphoto-shrink_400_400/B56ZarmokOHgAg-/0/1746635754828?e=1766620800&v=beta&t=b59zhbmO8SQ3YgMacr1319_iQdF5d5LrT4T-hwIfS38"
                  alt="Team Member A"
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Trịnh Anh Tài
              </h3>
              <p className="mb-4 text-lg font-semibold text-gray-600">
                Co-Founder & CEO
              </p>
              <p className="leading-relaxed text-gray-600">
                Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và thương
                mại điện tử, Trịnh Anh Tài dẫn dắt tầm nhìn chiến lược và phát
                triển của BidStorm.
              </p>
            </div>

            {/* Team Member B */}
            <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4E03AQGEtemqYmvAZw/profile-displayphoto-shrink_400_400/B4EZakSa3UGYAg-/0/1746513014755?e=1766620800&v=beta&t=Hq-gjw-DDMuVkKCuSd2V0DmL1aKAbh1rpB7b3x2Pyx8"
                  alt="Team Member B"
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Nguyễn Nhật Minh
              </h3>
              <p className="mb-4 text-lg font-semibold text-gray-600">
                Co-Founder & CTO
              </p>
              <p className="leading-relaxed text-gray-600">
                Chuyên gia về kiến trúc hệ thống và bảo mật, Nguyễn Nhật Minh
                đảm bảo nền tảng luôn vận hành mượt mà, an toàn và đáng tin cậy
                cho người dùng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-gray-900 to-black py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold">
            Tham gia cộng đồng BidStorm
          </h2>
          <p className="mb-8 text-xl text-gray-300">
            Khám phá hàng nghìn sản phẩm độc đáo và trải nghiệm đấu giá đẳng cấp
            ngay hôm nay
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dang-ky"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-100"
            >
              Đăng ký ngay
            </Link>
            <Link
              href="/lien-he"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              Liên hệ chúng tôi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
