import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getAllCategories } from "@/lib/api";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap", // Use 'swap' for improved performance
  variable: "--font-montserrat", // Define a CSS variable (optional, for Tailwind/CSS variables)
});

export const metadata: Metadata = {
  title: "BidStorm - Sàn Đấu Giá Trực Tuyến",
  description:
    "Trải nghiệm cảm giác của đấu giá trực tuyến. Tham gia cùng hàng nghìn người đấu giá và tìm kiếm những ưu đãi đặc biệt.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch categories for header
  const categories = await getAllCategories();

  return (
    <html lang="vi">
      <body className={`${montserrat.className} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
