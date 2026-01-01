import { AuthGuard } from "@/components/auth";
import { getProductDetailBySlug } from "@/services";
import { Metadata } from "next";
import { OrderCompletionClient } from "./OrderCompletionClient";

export const metadata: Metadata = {
  title: "Hoàn tất đơn hàng - BidStorm",
  description: "Hoàn tất giao dịch và thanh toán đơn hàng",
};

interface OrderCompletionPageProps {
  params: Promise<{ slug: string }>;
}

const OrderCompletionPage = async ({ params }: OrderCompletionPageProps) => {
  const { slug } = await params;
  console.log(slug);
  const productDetail = await getProductDetailBySlug(slug);

  return (
    <AuthGuard>
      <OrderCompletionClient product={productDetail} />
    </AuthGuard>
  );
};

export default OrderCompletionPage;
