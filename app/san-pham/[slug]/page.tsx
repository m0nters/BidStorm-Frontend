import { getProductDetailBySlug } from "@/services/products";
import { decode } from "he";
import { Metadata } from "next";
import NoProduct from "./NoProduct";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProductDetailBySlug(slug);

    // Strip HTML tags and decode HTML entities from description for meta description
    const plainDescription = decode(
      product.description.replace(/<[^>]*>/g, ""),
    ).substring(0, 160);

    const price = product.currentPrice.toLocaleString("vi-VN");
    const title = `${product.title} - Đấu giá trực tuyến | BidStorm`;

    return {
      title,
      description: `${plainDescription}... Giá hiện tại: ${price}₫. ${product.isEnded ? "Đã kết thúc" : "Đang đấu giá"}. ${product.bidCount} lượt đấu giá.`,
      openGraph: {
        title,
        description: plainDescription,
        images: product.images[0]?.imageUrl
          ? [{ url: product.images[0].imageUrl }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: plainDescription,
        images: product.images[0]?.imageUrl ? [product.images[0].imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Sản phẩm không tồn tại | BidStorm",
      description: "Không tìm thấy sản phẩm này trên BidStorm.",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product server-side for both metadata and initial render
  // This prevents duplicate API calls that increment view count
  try {
    const product = await getProductDetailBySlug(slug);
    return <ProductDetailClient slug={slug} initialProduct={product} />;
  } catch {
    return NoProduct();
  }
}
