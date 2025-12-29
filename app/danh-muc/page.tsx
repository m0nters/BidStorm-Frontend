import { getAllCategories } from "@/api";
import { redirect } from "next/navigation";

export default async function DanhMucPage() {
  let categories;

  try {
    categories = await getAllCategories();
  } catch (error) {
    console.error("Error loading categories:", error);
    redirect("/");
  }

  // Redirect to first category if available
  if (categories.length > 0) {
    const firstCategory = categories[0];
    redirect(`/danh-muc/${firstCategory.slug}`);
  }

  // If no categories, redirect to home
  redirect("/");
}
