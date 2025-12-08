"use client";

import PageHero from "@/components/layout/PageHero";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: "Bắt đầu",
    question: "Làm thế nào để đăng ký tài khoản trên BidStorm?",
    answer:
      'Bạn có thể đăng ký tài khoản miễn phí bằng cách nhấp vào nút "Đăng ký" ở góc trên bên phải. Cung cấp email, số điện thoại và tạo mật khẩu. Sau đó xác thực email và số điện thoại của bạn để bắt đầu đấu giá.',
  },
  {
    category: "Bắt đầu",
    question: "Tôi có cần xác thực danh tính không?",
    answer:
      "Để tham gia đấu giá, bạn cần xác thực email và số điện thoại. Đối với các giao dịch lớn hoặc bán hàng, chúng tôi có thể yêu cầu xác thực danh tính bổ sung bằng CMND/CCCD để đảm bảo an toàn.",
  },
  {
    category: "Bắt đầu",
    question: "BidStorm có tính phí đăng ký không?",
    answer:
      "Hoàn toàn miễn phí! Đăng ký tài khoản và tham gia đấu giá không mất bất kỳ chi phí nào. Chúng tôi chỉ tính phí hoa hồng nhỏ khi bạn bán thành công sản phẩm.",
  },

  // Bidding Process
  {
    category: "Đấu giá",
    question: "Làm thế nào để đặt giá thầu?",
    answer:
      "Tìm sản phẩm bạn quan tâm, nhấp vào nó để xem chi tiết. Nhập số tiền bạn muốn đặt (phải cao hơn giá hiện tại) và nhấp 'Đặt giá'. Hệ thống sẽ tự động xác nhận và bạn sẽ nhận được thông báo nếu ai đó đặt giá cao hơn.",
  },
  {
    category: "Đấu giá",
    question: "Đấu giá tự động là gì?",
    answer:
      "Đấu giá tự động cho phép bạn đặt giá tối đa bạn sẵn sàng trả. Hệ thống sẽ tự động tăng giá thầu của bạn từng chút một khi có người đặt giá cao hơn, cho đến khi đạt mức tối đa bạn đã đặt. Điều này giúp bạn không phải theo dõi liên tục.",
  },
  {
    category: "Đấu giá",
    question: "Tôi có thể rút lại giá thầu không?",
    answer:
      "Theo quy định, giá thầu không thể rút lại sau khi đã đặt, trừ khi có lỗi nghiêm trọng hoặc người bán thay đổi mô tả sản phẩm. Vui lòng cân nhắc kỹ trước khi đặt giá.",
  },
  {
    category: "Đấu giá",
    question: "Điều gì xảy ra khi tôi thắng đấu giá?",
    answer:
      "Bạn sẽ nhận được thông báo ngay lập tức qua email và SMS. Tiến hành thanh toán trong vòng 48 giờ. Sau khi thanh toán, người bán sẽ gửi hàng và bạn có thể theo dõi đơn hàng trong tài khoản của mình.",
  },

  // Payment & Fees
  {
    category: "Thanh toán",
    question: "BidStorm hỗ trợ những phương thức thanh toán nào?",
    answer:
      "Chúng tôi hỗ trợ chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay), thẻ tín dụng/ghi nợ nội địa và quốc tế. Tất cả giao dịch đều được mã hóa và bảo mật.",
  },
  {
    category: "Thanh toán",
    question: "Tiền của tôi có an toàn không?",
    answer:
      "Hoàn toàn an toàn. Chúng tôi sử dụng hệ thống thanh toán trung gian (escrow). Tiền của bạn sẽ được giữ an toàn cho đến khi bạn xác nhận đã nhận được hàng đúng như mô tả.",
  },
  {
    category: "Thanh toán",
    question: "Phí dịch vụ là bao nhiêu?",
    answer:
      "Người mua không phải trả phí dịch vụ. Người bán sẽ trả phí hoa hồng 5% trên giá bán cuối cùng khi giao dịch thành công. Phí này đã bao gồm chi phí xử lý thanh toán và bảo vệ giao dịch.",
  },
  {
    category: "Thanh toán",
    question: "Tôi có thể hoàn tiền không?",
    answer:
      "Bạn có thể yêu cầu hoàn tiền nếu sản phẩm không đúng như mô tả, bị hư hỏng, hoặc không nhận được hàng. Yêu cầu hoàn tiền phải được gửi trong vòng 7 ngày kể từ khi nhận hàng và kèm theo bằng chứng.",
  },

  // Selling
  {
    category: "Bán hàng",
    question: "Làm thế nào để bán sản phẩm trên BidStorm?",
    answer:
      "Đăng nhập và chọn 'Đăng sản phẩm'. Thêm ảnh chất lượng cao, mô tả chi tiết, đặt giá khởi điểm và thời gian đấu giá. Sau khi được duyệt (thường trong vòng 24 giờ), sản phẩm của bạn sẽ được hiển thị.",
  },
  {
    category: "Bán hàng",
    question: "Tôi có thể bán loại sản phẩm nào?",
    answer:
      "Bạn có thể bán hầu hết các sản phẩm hợp pháp bao gồm điện tử, thời trang, đồ sưu tầm, nội thất, v.v. Không được bán hàng giả, hàng cấm, vũ khí, động vật hoang dã, hoặc các mặt hàng vi phạm pháp luật.",
  },
  {
    category: "Bán hàng",
    question: "Khi nào tôi nhận được tiền sau khi bán?",
    answer:
      "Sau khi người mua xác nhận đã nhận hàng (hoặc sau 3 ngày tự động nếu không có khiếu nại), tiền sẽ được chuyển vào tài khoản BidStorm của bạn. Bạn có thể rút tiền về ngân hàng bất cứ lúc nào.",
  },

  // Safety & Security
  {
    category: "An toàn",
    question: "Làm thế nào để tránh bị lừa đảo?",
    answer:
      "Luôn giao dịch trong nền tảng BidStorm. Không chuyển tiền trực tiếp cho người bán. Kiểm tra đánh giá và lịch sử của người bán. Yêu cầu video hoặc ảnh bổ sung nếu cần. Liên hệ hỗ trợ nếu thấy bất thường.",
  },
  {
    category: "An toàn",
    question: "BidStorm bảo vệ thông tin cá nhân của tôi như thế nào?",
    answer:
      "Chúng tôi sử dụng mã hóa SSL 256-bit cho mọi dữ liệu. Thông tin cá nhân không bao giờ được chia sẻ với bên thứ ba không được phép. Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu.",
  },
  {
    category: "An toàn",
    question: "Tôi có thể báo cáo người dùng vi phạm không?",
    answer:
      "Có. Mỗi trang sản phẩm và hồ sơ người dùng đều có nút 'Báo cáo'. Chọn lý do và cung cấp bằng chứng. Đội ngũ của chúng tôi sẽ xem xét và xử lý trong vòng 24 giờ.",
  },

  // Technical
  {
    category: "Kỹ thuật",
    question: "Tôi có thể sử dụng BidStorm trên điện thoại không?",
    answer:
      "Có! Website BidStorm được tối ưu hóa cho mọi thiết bị di động. Bạn có thể duyệt, đặt giá, và quản lý tài khoản trên điện thoại dễ dàng như trên máy tính.",
  },
  {
    category: "Kỹ thuật",
    question: "Tôi không nhận được thông báo qua email?",
    answer:
      "Kiểm tra thư mục spam/junk của bạn. Thêm notifications@bidstorm.vn vào danh sách liên hệ an toàn. Bạn cũng có thể bật thông báo SMS trong cài đặt tài khoản.",
  },
  {
    category: "Kỹ thuật",
    question: "Làm thế nào để liên hệ hỗ trợ khách hàng?",
    answer:
      "Bạn có thể liên hệ qua: Email support@bidstorm.vn, Hotline 1900-xxxx (24/7), Live chat trên website, hoặc gửi yêu cầu trong phần 'Trung tâm trợ giúp' trên tài khoản.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  const categories = [
    "Tất cả",
    ...Array.from(new Set(faqData.map((item) => item.category))),
  ];

  const filteredFAQ =
    selectedCategory === "Tất cả"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        title="Câu hỏi thường gặp"
        subtitle="Tìm câu trả lời cho các thắc mắc của bạn"
      />

      {/* FAQ Content */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition-all duration-300 hover:border-gray-300"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex-1 pr-4">
                    <div className="mb-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {item.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.question}
                    </h3>
                  </div>
                  <FiChevronDown
                    className={`h-6 w-6 shrink-0 text-gray-600 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <p className="leading-relaxed text-gray-700">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Vẫn còn thắc mắc?
            </h2>
            <p className="mb-6 text-gray-600">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:support@bidstorm.vn"
                className="inline-flex items-center justify-center rounded-lg bg-black px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-800"
              >
                Email hỗ trợ
              </a>
              <a
                href="tel:1900xxxx"
                className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-all duration-300 hover:border-black hover:text-black"
              >
                Gọi hotline
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
