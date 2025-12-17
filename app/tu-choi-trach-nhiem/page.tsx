import { PageHero } from "@/components/layout/";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Từ chối Trách nhiệm"
        subtitle="Cập nhật lần cuối: 08 Tháng 12, 2024"
      />

      {/* Content Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12 rounded-2xl border-l-4 border-red-500 bg-red-50 p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Tuyên bố quan trọng
              </h2>
              <p className="leading-relaxed text-gray-700">
                Bằng cách truy cập và sử dụng nền tảng BidStorm, bạn công nhận
                và đồng ý rằng bạn hiểu và chấp nhận các rủi ro liên quan. Vui
                lòng đọc kỹ các từ chối trách nhiệm này.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                1. Từ chối trách nhiệm chung
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Nền tảng BidStorm được cung cấp trên cơ sở "như vậy" và "như
                được cung cấp" mà không có bất kỳ bảo đảm nào, rõ ràng hoặc ngụ
                ý. Chúng tôi từ chối trách nhiệm với bất kỳ:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Bảo đảm về tính chính xác:</strong> Thông tin trên nền
                  tảng có thể chứa các lỗi, thiếu sót hoặc không chính xác
                </li>
                <li>
                  <strong>Bảo đảm về tính sẵn sàng:</strong> Nền tảng có thể
                  không sẵn sàng hoặc được tạm dừng mà không cần thông báo
                </li>
                <li>
                  <strong>Bảo đảm về thích hợp:</strong> Nền tảng có thể không
                  phù hợp cho mục đích của bạn
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                2. Từ chối về thông tin
              </h2>
              <p className="leading-relaxed text-gray-700">
                Thông tin được cung cấp trên nền tảng của chúng tôi chỉ dành cho
                mục đích tham khảo. Chúng tôi không đảm bảo rằng bất kỳ thông
                tin nào:
              </p>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li>- Là chính xác, hoàn chỉnh hoặc cập nhật</li>
                <li>- Phù hợp với bất kỳ mục đích cụ thể nào</li>
                <li>- Không xâm phạm bất kỳ quyền của bên thứ ba nào</li>
                <li>- Không chứa virus hoặc các yếu tố có hại khác</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                3. Từ chối về giao dịch
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                BidStorm là một nền tảng tạo điều kiện cho các giao dịch giữa
                người mua và người bán. Chúng tôi từ chối trách nhiệm về:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Chất lượng sản phẩm:</strong> Chúng tôi không chịu
                  trách nhiệm cho chất lượng, điều kiện hoặc tính xác thực của
                  các sản phẩm được liệt kê
                </li>
                <li>
                  <strong>Vấn đề giao hàng:</strong> Chúng tôi không chịu trách
                  nhiệm về giao hàng trễ, mất mát hoặc hư hỏng
                </li>
                <li>
                  <strong>Tranh chấp thanh toán:</strong> Tranh chấp giữa người
                  mua và người bán là vấn đề của họ
                </li>
                <li>
                  <strong>Gian lận:</strong> Mặc dù chúng tôi cố gắng ngăn chặn
                  gian lận, chúng tôi không thể đảm bảo rằng nó sẽ không xảy ra
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                4. Từ chối về tính khả dụng
              </h2>
              <p className="leading-relaxed text-gray-700">
                Chúng tôi không đảm bảo rằng:
              </p>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li>
                  - Nền tảng sẽ hoạt động liên tục hoặc mà không có gián đoạn
                </li>
                <li>- Bất kỳ lỗi hoặc lỗi nào sẽ được sửa chữa ngay lập tức</li>
                <li>
                  - Nền tảng sẽ không bị hạn chế hoặc không khả dụng từng lúc
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                5. Từ chối về bảo mật
              </h2>
              <p className="leading-relaxed text-gray-700">
                Mặc dù chúng tôi sử dụng các biện pháp bảo mật hợp lý, chúng tôi
                không thể đảm bảo an toàn tuyệt đối của dữ liệu của bạn. Chúng
                tôi không chịu trách nhiệm về:
              </p>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li>
                  - Truy cập trái phép vào tài khoản hoặc thông tin của bạn
                </li>
                <li>- Lừa lọc hoặc các hình thức tấn công mạng khác</li>
                <li>
                  - Mất hoặc tiết lộ thông tin cá nhân do các hành động của bên
                  thứ ba
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                6. Từ chối về các liên kết bên thứ ba
              </h2>
              <p className="leading-relaxed text-gray-700">
                Nền tảng của chúng tôi có thể chứa các liên kết đến các trang
                web, sản phẩm hoặc dịch vụ của bên thứ ba. Chúng tôi không:
              </p>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li>
                  - Xác nhận, phê duyệt hoặc hỗ trợ bất kỳ nội dung bên thứ ba
                </li>
                <li>
                  - Chịu trách nhiệm về tính khả dụng hoặc độ chính xác của các
                  trang web bên thứ ba
                </li>
                <li>
                  - Chịu trách nhiệm về bất kỳ tổn hại phát sinh từ sử dụng các
                  liên kết này
                </li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                7. Giới hạn trách nhiệm
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Trong mọi trường hợp được phép bởi luật pháp, BidStorm sẽ không
                chịu trách nhiệm về:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>
                  - Bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc theo
                  hậu quả
                </li>
                <li>- Mất doanh thu, lợi nhuận, dữ liệu hoặc sử dụng</li>
                <li>
                  - Ngay cả khi BidStorm đã được thông báo về khả năng xảy ra
                  những thiệt hại như vậy
                </li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                8. Từ chối về pháp lý
              </h2>
              <p className="leading-relaxed text-gray-700">
                Chúng tôi không cung cấp lời khuyên pháp lý. Nếu bạn cần lời
                khuyên pháp lý, vui lòng tham khảo với một luật sư. Sử dụng nền
                tảng của chúng tôi không tạo ra mối quan hệ luật sư-thân chủ
                giữa bạn và chúng tôi.
              </p>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                9. Từ chối về dịch vụ khách hàng
              </h2>
              <p className="leading-relaxed text-gray-700">
                Mặc dù chúng tôi cố gắng cung cấp dịch vụ khách hàng tốt, chúng
                tôi không đảm bảo:
              </p>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li>- Bạn sẽ nhận được các phản hồi cho tất cả các yêu cầu</li>
                <li>
                  - Các vấn đề sẽ được giải quyết trong bất kỳ khung thời gian
                  cụ thể nào
                </li>
                <li>- Chúng tôi có thể giải quyết tất cả các yêu cầu</li>
              </ul>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                10. Từ chối về sử dụng bất hợp pháp
              </h2>
              <p className="leading-relaxed text-gray-700">
                Bạn đồng ý sử dụng nền tảng chỉ cho các mục đích hợp pháp. Chúng
                tôi từ chối trách nhiệm về bất kỳ sử dụng bất hợp pháp nào của
                nền tảng, bao gồm nhưng không giới hạn ở:
              </p>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li>- Vi phạm bất kỳ luật hoặc quy định nào</li>
                <li>- Xâm phạm quyền sở hữu trí tuệ</li>
                <li>- Tệp đính kèm độc hại hoặc nội dung không thích hợp</li>
                <li>- Quấy rối hoặc làm phiền người khác</li>
              </ul>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                11. Sửa đổi từ chối trách nhiệm
              </h2>
              <p className="leading-relaxed text-gray-700">
                BidStorm có quyền sửa đổi các từ chối trách nhiệm này bất kỳ lúc
                nào mà không cần thông báo trước. Sử dụng tiếp tục của bạn đối
                với nền tảng sau các sửa đổi có nghĩa là bạn chấp nhận các từ
                chối trách nhiệm mới.
              </p>
            </div>

            {/* Section 12 */}
            <div className="mb-10">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                12. Liên hệ với chúng tôi
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Nếu bạn có bất kỳ câu hỏi nào về các từ chối trách nhiệm này,
                vui lòng liên hệ với chúng tôi:
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@bidstorm.com
                </p>
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong> BidStorm, Hồ Chí Minh, Việt Nam
                </p>
                <p className="text-gray-700">
                  <strong>Điện thoại:</strong> +84 (0)123 456 789
                </p>
              </div>
            </div>

            {/* Final Note */}
            <div className="rounded-2xl border-l-4 border-yellow-500 bg-yellow-50 p-8">
              <p className="text-sm font-semibold text-gray-900">
                ⚠️ LƯU Ý QUAN TRỌNG
              </p>
              <p className="mt-2 leading-relaxed text-gray-700">
                Bằng cách sử dụng nền tảng BidStorm, bạn xác nhận rằng bạn đã
                đọc, hiểu và chấp nhận tất cả các từ chối trách nhiệm trong tài
                liệu này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng
                ngừng sử dụng nền tảng ngay lập tức.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
