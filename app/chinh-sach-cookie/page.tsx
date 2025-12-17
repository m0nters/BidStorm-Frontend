"use client";

import { PageHero } from "@/components/layout/";
import { CookiePreferences } from "@/components/legal/";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Chính sách Cookie"
        subtitle="Cập nhật lần cuối: 08 Tháng 12, 2024"
      />

      {/* Content Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12 rounded-2xl bg-blue-50 p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Hiểu biết về Cookie
              </h2>
              <p className="leading-relaxed text-gray-700">
                Chính sách Cookie này giải thích cách BidStorm sử dụng cookie và
                các công nghệ theo dõi tương tự khác trên nền tảng của chúng
                tôi. Bằng cách sử dụng trang web của chúng tôi, bạn đồng ý với
                việc sử dụng cookie của chúng tôi như được mô tả dưới đây.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                1. Cookie là gì?
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Cookie là những tệp văn bản nhỏ được lưu trữ trên máy tính, máy
                tính bảng hoặc thiết bị di động của bạn khi bạn truy cập một
                trang web. Chúng được sử dụng rộng rãi để làm cho các trang web
                hoạt động hiệu quả hơn, cũng như cung cấp thông tin cho chủ sở
                hữu trang web.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                Cookie có thể chứa nhiều loại thông tin khác nhau như tên người
                dùng, ID phiên, mã xác thực, thông tin giỏ hàng, tùy chọn ngôn
                ngữ và nhiều dữ liệu khác. Khi bạn truy cập lại trang web, các
                cookie này được gửi trở lại máy chủ để nhận diện bạn và tùy
                chỉnh trải nghiệm của bạn.
              </p>
              <p className="leading-relaxed text-gray-700">
                Cookie có thể là "session cookies" (cookie phiên) sẽ bị xóa khi
                bạn đóng trình duyệt, hoặc "persistent cookies" (cookie lâu dài)
                được lưu trữ trên thiết bị của bạn trong một khoảng thời gian
                nhất định, thậm chí sau khi bạn đóng trình duyệt.
              </p>
            </div>

            {/* Cookie Preferences Component */}
            <div className="mb-12">
              <CookiePreferences />
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                2. Các loại Cookie chúng tôi sử dụng
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    2.1 Cookie Cần thiết
                  </h3>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Các cookie này là thiết yếu để trang web hoạt động đúng cách
                    và không thể bị tắt trong hệ thống của chúng tôi. Chúng
                    thường chỉ được đặt để đáp ứng các hành động do bạn thực
                    hiện tương đương với yêu cầu dịch vụ, chẳng hạn như đặt tùy
                    chọn bảo mật của bạn, đăng nhập hoặc điền vào biểu mẫu.
                  </p>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Bạn có thể đặt trình duyệt của mình để chặn hoặc cảnh báo
                    bạn về những cookie này, nhưng một số phần của trang web sẽ
                    không hoạt động. Những cookie này không lưu trữ bất kỳ thông
                    tin cá nhân có thể nhận dạng nào.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="mb-2 font-semibold text-gray-900">
                      Ví dụ về Cookie Cần thiết:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>• session_id:</strong> Theo dõi phiên làm việc
                        của bạn trên nền tảng, đảm bảo bạn vẫn đăng nhập khi
                        điều hướng giữa các trang
                      </li>
                      <li>
                        <strong>• auth_token:</strong> Xác thực danh tính của
                        bạn và bảo vệ tài khoản khỏi truy cập trái phép
                      </li>
                      <li>
                        <strong>• csrf_token:</strong> Bảo vệ chống lại các cuộc
                        tấn công Cross-Site Request Forgery (CSRF)
                      </li>
                      <li>
                        <strong>• cart_id:</strong> Lưu trữ thông tin giỏ hàng
                        của bạn trong quá trình mua sắm
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    2.2 Cookie Phân tích
                  </h3>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Chúng tôi sử dụng các công cụ phân tích như Google
                    Analytics, Mixpanel và các công cụ tương tự để thu thập
                    thông tin về cách khách truy cập tương tác với trang web của
                    chúng tôi. Những cookie này cho phép chúng tôi đếm số lượng
                    khách truy cập, xác định nguồn lưu lượng truy cập đến từ đâu
                    và hiểu cách khách truy cập di chuyển trong trang web.
                  </p>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Tất cả thông tin được thu thập bởi các cookie này đều được
                    tổng hợp và do đó là ẩn danh. Nếu bạn không cho phép những
                    cookie này, chúng tôi sẽ không biết khi nào bạn đã truy cập
                    trang web của chúng tôi và sẽ không thể giám sát hiệu suất
                    của nó.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="mb-2 font-semibold text-gray-900">
                      Ví dụ về Cookie Phân tích:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>• _ga:</strong> Đăng ký một ID duy nhất để tạo
                        dữ liệu thống kê về cách khách truy cập sử dụng trang
                        web (thời hạn: 2 năm)
                      </li>
                      <li>
                        <strong>• _gid:</strong> Đăng ký một ID duy nhất để tạo
                        dữ liệu thống kê về cách khách truy cập sử dụng trang
                        web (thời hạn: 24 giờ)
                      </li>
                      <li>
                        <strong>• _gat:</strong> Được sử dụng bởi Google
                        Analytics để điều tiết tỷ lệ yêu cầu (thời hạn: 1 phút)
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    2.3 Cookie Chức năng
                  </h3>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Những cookie này cho phép trang web ghi nhớ các lựa chọn bạn
                    thực hiện (chẳng hạn như tên người dùng, ngôn ngữ hoặc khu
                    vực bạn đang ở) và cung cấp các tính năng nâng cao, được cá
                    nhân hóa hơn. Những cookie này cũng có thể được sử dụng để
                    ghi nhớ các thay đổi bạn đã thực hiện đối với kích thước văn
                    bản, phông chữ và các phần khác của trang web mà bạn có thể
                    tùy chỉnh.
                  </p>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Chúng cũng có thể được sử dụng để cung cấp các dịch vụ bạn
                    đã yêu cầu như xem video hoặc bình luận trên blog. Thông tin
                    mà các cookie này thu thập có thể được ẩn danh và chúng
                    không thể theo dõi hoạt động duyệt web của bạn trên các
                    trang web khác.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="mb-2 font-semibold text-gray-900">
                      Ví dụ về Cookie Chức năng:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>• preferences:</strong> Lưu trữ các tùy chọn
                        hiển thị như bố cục trang, chế độ tối/sáng
                      </li>
                      <li>
                        <strong>• language:</strong> Ghi nhớ ngôn ngữ ưa thích
                        của bạn để tự động hiển thị nội dung phù hợp
                      </li>
                      <li>
                        <strong>• currency:</strong> Lưu đơn vị tiền tệ bạn muốn
                        sử dụng để hiển thị giá sản phẩm
                      </li>
                      <li>
                        <strong>• recently_viewed:</strong> Theo dõi các sản
                        phẩm bạn đã xem gần đây để hiển thị lại
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    2.4 Cookie Marketing
                  </h3>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Những cookie này được sử dụng để theo dõi khách truy cập
                    trên các trang web. Mục đích là hiển thị quảng cáo có liên
                    quan và hấp dẫn đối với người dùng cá nhân và do đó có giá
                    trị hơn cho các nhà xuất bản và nhà quảng cáo bên thứ ba.
                    Cookie marketing theo dõi hành vi duyệt web của bạn để tạo
                    hồ sơ về sở thích của bạn.
                  </p>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Những cookie này thường được đặt bởi các mạng quảng cáo với
                    sự cho phép của chủ sở hữu trang web. Chúng ghi nhớ rằng bạn
                    đã truy cập một trang web và thông tin này được chia sẻ với
                    các tổ chức khác như nhà quảng cáo. Khá thường xuyên, cookie
                    marketing sẽ được liên kết với chức năng trang web do tổ
                    chức khác cung cấp.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="mb-2 font-semibold text-gray-900">
                      Ví dụ về Cookie Marketing:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>• Facebook Pixel (_fbp):</strong> Được sử dụng
                        để theo dõi hoạt động từ quảng cáo Facebook, đo lường và
                        tối ưu hóa hiệu suất quảng cáo
                      </li>
                      <li>
                        <strong>• Google Ads (IDE, _gcl_*):</strong> Theo dõi
                        chuyển đổi quảng cáo Google và hiển thị quảng cáo được
                        nhắm mục tiêu
                      </li>
                      <li>
                        <strong>• Retargeting cookies:</strong> Cho phép chúng
                        tôi hiển thị quảng cáo cho bạn trên các trang web khác
                        sau khi bạn đã truy cập trang web của chúng tôi
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                3. Cookie của bên thứ ba
              </h2>
              <p className="leading-relaxed text-gray-700">
                Chúng tôi cho phép các công ty bên thứ ba đặt cookie trên nền
                tảng của chúng tôi để cung cấp các dịch vụ, chẳng hạn như phân
                tích, quảng cáo và thanh toán. Các công ty này có thể sử dụng
                thông tin được thu thập thông qua cookie của họ để:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li>• Cung cấp quảng cáo được nhắm mục tiêu</li>
                <li>• Đo lường hiệu quả của các chiến dịch quảng cáo</li>
                <li>• Hiểu rõ hơn về nhu cầu của bạn</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                4. Kiểm soát Cookie
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Bạn có thể kiểm soát và/hoặc xóa cookie theo ý muốn. Bạn có thể
                xóa tất cả cookie được lưu trữ trên máy tính của bạn và bạn có
                thể đặt hầu hết các trình duyệt để ngăn chặn cookie được đặt.
                Tuy nhiên, nếu bạn làm như vậy, bạn có thể phải tự điều chỉnh
                một số tùy chọn và bạn có thể gặp khó khăn khi truy cập các phần
                nhất định của nền tảng của chúng tôi.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Hướng dẫn trình duyệt
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>Chrome:</strong> Cài đặt → Quyền riêng tư và bảo
                      mật → Cookie và dữ liệu trang web khác
                    </li>
                    <li>
                      <strong>Firefox:</strong> Tùy chọn → Quyền riêng tư và bảo
                      mật → Cookie
                    </li>
                    <li>
                      <strong>Safari:</strong> Tùy chọn → Quyền riêng tư → Quản
                      lý dữ liệu trang web
                    </li>
                    <li>
                      <strong>Edge:</strong> Cài đặt → Quyền riêng tư → Xóa dữ
                      liệu duyệt web
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Chọn không nhận quảng cáo theo dõi
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    Bạn có thể chọn không nhận quảng cáo được nhắm mục tiêu bằng
                    cách truy cập các sở thích quảng cáo:
                  </p>
                  <ul className="mt-2 space-y-2 text-gray-700">
                    <li>
                      •{" "}
                      <a
                        href="https://myaccount.google.com/data-and-privacy"
                        className="text-blue-600 hover:underline"
                      >
                        Google Ads Settings
                      </a>
                    </li>
                    <li>
                      •{" "}
                      <a
                        href="https://www.facebook.com/ads/preferences"
                        className="text-blue-600 hover:underline"
                      >
                        Facebook Ads Preferences
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                5. Do Not Track (DNT)
              </h2>
              <p className="leading-relaxed text-gray-700">
                Một số trình duyệt bao gồm một tính năng Do Not Track (DNT). Các
                trang web hiện tại không có tiêu chuẩn thống nhất để nhận diện
                hoặc phản ứng với tín hiệu DNT. Vì lý do này, chúng tôi hiện
                không phản ứng với tín hiệu DNT của trình duyệt.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                6. Cập nhật chính sách
              </h2>
              <p className="leading-relaxed text-gray-700">
                Chúng tôi có thể cập nhật chính sách cookie này từ lúc này sang
                lúc khác để phản ánh những thay đổi trong các công nghệ, pháp
                luật và các yếu tố khác. Vui lòng xem lại chính sách này thường
                xuyên để cập nhật các thay đổi.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                7. Liên hệ với chúng tôi
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Nếu bạn có câu hỏi về chính sách cookie này, vui lòng liên hệ
                với chúng tôi:
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> cookies@bidstorm.com
                </p>
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong> BidStorm, Hồ Chí Minh, Việt Nam
                </p>
                <p className="text-gray-700">
                  <strong>Điện thoại:</strong> +84 (0)123 456 789
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
