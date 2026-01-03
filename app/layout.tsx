import { getAllCategories } from "@/api";
import { ConditionalLayout } from "@/components/layout/";
import { AuthProvider } from "@/components/providers/AuthProvider";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  // Fetch all categories for header
  // Client component will decide whether to show header/footer
  const categories = await getAllCategories();

  return (
    <html lang="vi">
      <body
        className={`${montserrat.className} suppressHydrationWarning font-sans antialiased`}
      >
        <AuthProvider>
          <ConditionalLayout categories={categories}>
            {children}
          </ConditionalLayout>
          <ToastContainer
            position="top-right"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
