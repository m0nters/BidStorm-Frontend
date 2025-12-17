import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";

interface CategoryPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    size?: string;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug.join("/");

  try {
    const category = await getCategoryBySlug(slugString);

    return {
      title: `${category.name} - Đấu giá sản phẩm | BidStorm`,
      description: `Khám phá các sản phẩm đấu giá trong danh mục ${category.name}. Tham gia đấu giá ngay hôm nay!`,
    };
  } catch {
    return {
      title: "Danh mục không tồn tại | BidStorm",
    };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const slugString = slug.join("/");
  console.log(slugString);
  const search = await searchParams;

  try {
    // Fetch category and all categories in parallel
    const [category, allCategories] = await Promise.all([
      getCategoryBySlug(slugString),
      getAllCategories(),
    ]);

    // Parse pagination params
    const page = parseInt(search.page || "1") - 1; // Convert to 0-indexed
    const size = parseInt(search.size || "20"); // currently using `lg:grid-cols-4`, meaning 5 rows
    const sortBy = search.sortBy || "endTime";
    const sortDirection = search.sortDirection || "asc";

    // Fetch products for this category
    const products = await getProductsByCategory(category.id, {
      page,
      size,
      sortBy,
      sortDirection,
    });

    return (
      <CategoryPageClient
        category={category}
        allCategories={allCategories}
        initialProducts={products}
      />
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}
