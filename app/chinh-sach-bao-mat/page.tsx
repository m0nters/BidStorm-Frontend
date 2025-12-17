import { PageHero } from "@/components/layout/";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Chính sách Bảo mật"
        subtitle="Cập nhật lần cuối: 08 Tháng 12, 2024"
      />

      {/* Content Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12 rounded-2xl bg-blue-50 p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Bảo vệ Thông tin Của bạn
              </h2>
              <p className="leading-relaxed text-gray-700">
                BidStorm cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo
                mật này giải thích cách chúng tôi thu thập, sử dụng, công khai
                và bảo vệ thông tin của bạn khi bạn sử dụng nền tảng của chúng
                tôi.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                1. Thông tin chúng tôi thu thập
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    1.1 Thông tin cá nhân
                  </h3>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Khi bạn đăng ký tài khoản hoặc sử dụng các dịch vụ của chúng
                    tôi, chúng tôi có thể thu thập các loại thông tin cá nhân
                    sau. Việc thu thập này là cần thiết để cung cấp dịch vụ tốt
                    nhất cho bạn:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-700">
                    <li>
                      <strong>• Thông tin định danh:</strong> Họ tên đầy đủ, tên
                      người dùng, địa chỉ email, số điện thoại di động, ngày
                      sinh, giới tính
                    </li>
                    <li>
                      <strong>• Thông tin địa chỉ:</strong> Địa chỉ giao hàng,
                      địa chỉ thanh toán, thành phố, tỉnh/thành, mã bưu điện,
                      quốc gia
                    </li>
                    <li>
                      <strong>• Thông tin thanh toán:</strong> Số thẻ tín
                      dụng/ghi nợ (được mã hóa), thông tin tài khoản ngân hàng,
                      thông tin ví điện tử (Momo, ZaloPay, VNPay)
                    </li>
                    <li>
                      <strong>• Thông tin giao dịch:</strong> Lịch sử mua hàng,
                      sản phẩm trong giỏ hàng, danh sách yêu thích, lịch sử đấu
                      giá
                    </li>
                    <li>
                      <strong>• Thông tin xác minh:</strong> Số CMND/CCCD, ảnh
                      chân dung, thông tin xác minh danh tính (nếu yêu cầu)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    1.2 Thông tin sử dụng và kỹ thuật
                  </h3>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Chúng tôi tự động thu thập thông tin về cách bạn truy cập và
                    sử dụng nền tảng của chúng tôi. Dữ liệu này giúp chúng tôi
                    hiểu hành vi người dùng và cải thiện trải nghiệm:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-700">
                    <li>
                      <strong>• Dữ liệu thiết bị:</strong> Địa chỉ IP, loại
                      thiết bị, ID thiết bị duy nhất, loại trình duyệt và phiên
                      bản, hệ điều hành, độ phân giải màn hình
                    </li>
                    <li>
                      <strong>• Dữ liệu hoạt động:</strong> Trang đã xem, thời
                      gian truy cập, đường dẫn điều hướng, các tìm kiếm đã thực
                      hiện, nút đã nhấp, thời gian sử dụng
                    </li>
                    <li>
                      <strong>• Dữ liệu vị trí:</strong> Vị trí địa lý gần đúng
                      dựa trên địa chỉ IP hoặc GPS (nếu được phép)
                    </li>
                    <li>
                      <strong>• Dữ liệu tương tác:</strong> Sản phẩm đã xem, sản
                      phẩm đã tìm kiếm, đánh giá và nhận xét, thông tin liên lạc
                      với người bán
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    1.3 Cookie và công nghệ theo dõi
                  </h3>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    Chúng tôi sử dụng cookie, web beacons, pixel tags và các
                    công nghệ theo dõi tương tự để thu thập thông tin về hoạt
                    động của bạn trên nền tảng. Những công nghệ này giúp chúng
                    tôi:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-700">
                    <li>• Ghi nhớ đăng nhập và tùy chọn của bạn</li>
                    <li>• Hiểu cách bạn sử dụng dịch vụ của chúng tôi</li>
                    <li>• Cá nhân hóa nội dung và quảng cáo</li>
                    <li>• Đo lường hiệu quả của chiến dịch marketing</li>
                    <li>• Phát hiện và ngăn chặn gian lận</li>
                  </ul>
                  <p className="mt-3 leading-relaxed text-gray-700">
                    Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt
                    của mình. Tuy nhiên, việc vô hiệu hóa cookie có thể ảnh
                    hưởng đến khả năng sử dụng một số tính năng của nền tảng.
                    Xem thêm tại{" "}
                    <Link
                      href="/chinh-sach-cookie"
                      className="text-blue-600 hover:underline"
                    >
                      Chính sách Cookie
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                2. Cách chúng tôi sử dụng thông tin của bạn
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Chúng tôi sử dụng thông tin bạn cung cấp cho các mục đích sau:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Cung cấp dịch vụ:</strong> Xử lý đơn hàng, gửi xác
                  nhận và hỗ trợ khách hàng
                </li>
                <li>
                  <strong>Cải thiện dịch vụ:</strong> Phân tích cách bạn sử dụng
                  nền tảng để tối ưu hóa trải nghiệm
                </li>
                <li>
                  <strong>Giao tiếp:</strong> Gửi thông báo, cập nhật và thông
                  tin marketing (với sự đồng ý của bạn)
                </li>
                <li>
                  <strong>Phòng chống gian lận:</strong> Bảo vệ tài khoản của
                  bạn và phát hiện hoạt động bất thường
                </li>
                <li>
                  <strong>Tuân thủ pháp luật:</strong> Tuân thủ các yêu cầu pháp
                  luật và quy định
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                3. Chia sẻ thông tin của bạn
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba.
                Tuy nhiên, chúng tôi có thể chia sẻ thông tin với:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Nhà cung cấp dịch vụ:</strong> Các công ty xử lý thanh
                  toán, giao hàng và hỗ trợ khách hàng
                </li>
                <li>
                  <strong>Đối tác kinh doanh:</strong> Khi được yêu cầu bởi pháp
                  luật hoặc để thực hiện giao dịch
                </li>
                <li>
                  <strong>Cơ quan chính phủ:</strong> Khi được yêu cầu theo pháp
                  luật hoặc để bảo vệ quyền của chúng tôi
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                4. Bảo mật dữ liệu
              </h2>
              <p className="leading-relaxed text-gray-700">
                Chúng tôi sử dụng mã hóa SSL/TLS và các biện pháp bảo mật khác
                để bảo vệ thông tin của bạn. Tuy nhiên, không có phương pháp
                truyền tải dữ liệu trên internet hoàn toàn an toàn. Bạn sử dụng
                dịch vụ của chúng tôi với rủi ro của riêng bạn.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                5. Quyền của bạn
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Tùy theo pháp luật địa phương, bạn có quyền:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>• Truy cập thông tin cá nhân của bạn được lưu trữ</li>
                <li>• Yêu cầu sửa hoặc xóa thông tin của bạn</li>
                <li>• Từ chối xử lý thông tin cho các mục đích nhất định</li>
                <li>• Rút lại sự đồng ý xử lý dữ liệu bất kỳ lúc nào</li>
                <li>
                  • Yêu cầu dữ liệu của bạn được cung cấp ở định dạng di động
                </li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-700">
                Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua
                email: privacy@bidstorm.com
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                6. Lưu giữ dữ liệu
              </h2>
              <p className="leading-relaxed text-gray-700">
                Chúng tôi lưu giữ dữ liệu cá nhân của bạn chỉ trong thời gian
                cần thiết để cung cấp dịch vụ, tuân thủ pháp luật hoặc giải
                quyết tranh chấp. Thời gian lưu giữ khác nhau tùy theo loại dữ
                liệu và mục đích xử lý.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                7. Liên kết bên thứ ba
              </h2>
              <p className="leading-relaxed text-gray-700">
                Nền tảng của chúng tôi có thể chứa các liên kết đến các trang
                web của bên thứ ba. Chúng tôi không chịu trách nhiệm về chính
                sách bảo mật của các trang web này. Vui lòng đọc chính sách bảo
                mật của họ trước khi cung cấp thông tin cá nhân.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                8. Thay đổi chính sách
              </h2>
              <p className="leading-relaxed text-gray-700">
                Chúng tôi có thể cập nhật chính sách bảo mật này từ thời gian
                này sang thời gian khác. Bất kỳ thay đổi nào sẽ được đăng tải
                trên trang này với ngày cập nhật mới. Sử dụng tiếp tục của bạn
                đối với nền tảng sau khi bất kỳ thay đổi nào có nghĩa là bạn
                chấp nhận các điều khoản mới.
              </p>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                9. Liên hệ với chúng tôi
              </h2>
              <p className="leading-relaxed text-gray-700">
                Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc các
                cách xử lý dữ liệu của chúng tôi, vui lòng liên hệ với chúng
                tôi:
              </p>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@bidstorm.com
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
