import { PageHero } from "@/components/layout/";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        title="Điều khoản dịch vụ"
        subtitle="Cập nhật lần cuối: 08 Tháng 12, 2024"
      />

      {/* Content Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12 rounded-2xl bg-blue-50 p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Chào mừng đến với BidStorm
              </h2>
              <p className="leading-relaxed text-gray-700">
                Bằng việc truy cập và sử dụng nền tảng BidStorm, bạn đồng ý tuân
                thủ và bị ràng buộc bởi các điều khoản và điều kiện sau đây. Vui
                lòng đọc kỹ trước khi sử dụng dịch vụ của chúng tôi.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                1. Chấp nhận điều khoản
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Khi đăng ký tài khoản, truy cập hoặc sử dụng bất kỳ dịch vụ nào
                của BidStorm, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị
                ràng buộc bởi các Điều khoản Dịch vụ này cũng như Chính sách Bảo
                mật của chúng tôi.
              </p>
              <p className="leading-relaxed text-gray-700">
                Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này,
                vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                2. Đăng ký tài khoản
              </h2>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                2.1 Điều kiện đăng ký
              </h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Bạn phải đủ 18 tuổi trở lên để đăng ký tài khoản</li>
                <li>
                  Cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký
                </li>
                <li>Chỉ được tạo một tài khoản cho mỗi cá nhân/tổ chức</li>
                <li>Không được chuyển nhượng tài khoản cho người khác</li>
              </ul>

              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                2.2 Bảo mật tài khoản
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Bạn chịu trách nhiệm bảo mật mật khẩu và tài khoản của mình. Mọi
                hoạt động diễn ra dưới tài khoản của bạn là trách nhiệm của bạn.
                Thông báo ngay cho chúng tôi nếu phát hiện bất kỳ sử dụng trái
                phép nào.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                3. Quy tắc đấu giá
              </h2>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                3.1 Đặt giá thầu
              </h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Mỗi giá thầu được coi là một cam kết mua có tính ràng buộc
                </li>
                <li>
                  Giá thầu không thể rút lại sau khi đã đặt, trừ trường hợp đặc
                  biệt
                </li>
                <li>Bạn phải có đủ khả năng thanh toán cho giá thầu đã đặt</li>
                <li>Không được sử dụng nhiều tài khoản để thao túng giá</li>
              </ul>

              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                3.2 Người bán
              </h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Phải mô tả sản phẩm chính xác và trung thực</li>
                <li>Cung cấp ảnh chất lượng thật của sản phẩm</li>
                <li>
                  Không được bán hàng giả, hàng cấm hoặc vi phạm pháp luật
                </li>
                <li>Giao hàng đúng thời hạn sau khi nhận thanh toán</li>
                <li>Chịu trách nhiệm về chất lượng và xuất xứ của sản phẩm</li>
              </ul>

              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                3.3 Kết thúc đấu giá
              </h3>
              <p className="leading-relaxed text-gray-700">
                Người đặt giá cao nhất khi hết thời gian đấu giá sẽ thắng và có
                nghĩa vụ hoàn tất giao dịch. Người thắng phải thanh toán trong
                vòng 48 giờ kể từ khi nhận thông báo.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                4. Thanh toán và phí dịch vụ
              </h2>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                4.1 Phí dịch vụ
              </h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Người mua: Miễn phí</li>
                <li>Người bán: 5% trên giá bán cuối cùng</li>
                <li>Phí được trừ tự động khi thanh toán</li>
              </ul>

              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                4.2 Thanh toán
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Tất cả giao dịch phải được thực hiện thông qua hệ thống thanh
                toán của BidStorm. Chúng tôi sử dụng hệ thống trung gian
                (escrow) để bảo vệ cả người mua và người bán. Tiền chỉ được
                chuyển cho người bán sau khi người mua xác nhận đã nhận hàng.
              </p>

              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                4.3 Hoàn tiền
              </h3>
              <p className="leading-relaxed text-gray-700">
                Hoàn tiền được xem xét trong các trường hợp: sản phẩm không đúng
                mô tả, hư hỏng, hoặc không nhận được hàng. Yêu cầu hoàn tiền
                phải được gửi trong vòng 7 ngày kèm bằng chứng.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                5. Hành vi cấm
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Người dùng không được phép:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Gian lận, lừa đảo hoặc thao túng đấu giá</li>
                <li>Sử dụng nhiều tài khoản để nâng giá ảo</li>
                <li>
                  Đăng sản phẩm vi phạm pháp luật hoặc quyền sở hữu trí tuệ
                </li>
                <li>Quấy rối, lăng mạ hoặc đe dọa người dùng khác</li>
                <li>Spam, gửi thông tin quảng cáo không mong muốn</li>
                <li>Sử dụng bot hoặc công cụ tự động không được phép</li>
                <li>Cố gắng hack hoặc phá hoại hệ thống</li>
                <li>Giao dịch bên ngoài nền tảng để tránh phí dịch vụ</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                6. Quyền sở hữu trí tuệ
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Tất cả nội dung trên BidStorm bao gồm văn bản, đồ họa, logo,
                biểu tượng, hình ảnh, âm thanh, phần mềm và mã nguồn là tài sản
                của BidStorm hoặc các bên cấp phép và được bảo vệ bởi luật sở
                hữu trí tuệ.
              </p>
              <p className="leading-relaxed text-gray-700">
                Bạn không được sao chép, sửa đổi, phân phối hoặc tái xuất bản
                bất kỳ nội dung nào từ nền tảng mà không có sự cho phép bằng văn
                bản từ BidStorm.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                7. Giới hạn trách nhiệm
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                BidStorm hoạt động như một nền tảng kết nối người mua và người
                bán. Chúng tôi không phải là người bán và không sở hữu các sản
                phẩm được đăng tải.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                Chúng tôi không chịu trách nhiệm về:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Chất lượng, độ an toàn hoặc tính hợp pháp của sản phẩm</li>
                <li>Tính chính xác của mô tả sản phẩm</li>
                <li>
                  Khả năng của người bán giao hàng hoặc người mua thanh toán
                </li>
                <li>
                  Thiệt hại trực tiếp hoặc gián tiếp từ việc sử dụng dịch vụ
                </li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Tuy nhiên, chúng tôi cam kết hỗ trợ giải quyết tranh chấp và bảo
                vệ quyền lợi người dùng trong khả năng của mình.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                8. Chấm dứt tài khoản
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                BidStorm có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Vi phạm bất kỳ điều khoản nào trong thỏa thuận này</li>
                <li>Có hành vi gian lận hoặc lừa đảo</li>
                <li>Nhận nhiều đánh giá tiêu cực hoặc khiếu nại</li>
                <li>Không hoàn thành nghĩa vụ thanh toán hoặc giao hàng</li>
                <li>Yêu cầu chấm dứt tài khoản của chính bạn</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Khi tài khoản bị chấm dứt, bạn vẫn phải hoàn thành các giao dịch
                đang chờ xử lý.
              </p>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                9. Thay đổi điều khoản
              </h2>
              <p className="leading-relaxed text-gray-700">
                BidStorm có quyền sửa đổi các Điều khoản Dịch vụ này bất cứ lúc
                nào. Thay đổi sẽ có hiệu lực ngay khi được đăng tải trên nền
                tảng. Việc bạn tiếp tục sử dụng dịch vụ sau khi thay đổi đồng
                nghĩa với việc chấp nhận các điều khoản mới.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                10. Luật áp dụng
              </h2>
              <p className="leading-relaxed text-gray-700">
                Các Điều khoản Dịch vụ này được điều chỉnh và hiểu theo luật
                pháp của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp
                phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền tại Thành
                phố Hồ Chí Minh.
              </p>
            </div>

            {/* Contact */}
            <div className="mt-12 rounded-2xl bg-gray-50 p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Liên hệ</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Dịch vụ này, vui
                lòng liên hệ:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@bidstorm.vn
                </p>
                <p>
                  <strong>Hotline:</strong> 1900-xxxx
                </p>
                <p>
                  <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP. Hồ Chí
                  Minh
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
