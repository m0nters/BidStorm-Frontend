import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - BidStorm",
  description: "Quản lý hệ thống đấu giá BidStorm",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
