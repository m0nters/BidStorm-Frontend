"use client";

import { CategoryResponse } from "@/types";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface ConditionalLayoutProps {
  children: ReactNode;
  categories: CategoryResponse[];
}

/**
 * Client component that conditionally renders Header/Footer based on current pathname
 * This ensures proper layout switching during client-side navigation
 */
export const ConditionalLayout = ({
  children,
  categories,
}: ConditionalLayoutProps) => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes: no header/footer
    return <>{children}</>;
  }

  // Regular routes: with header/footer
  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
