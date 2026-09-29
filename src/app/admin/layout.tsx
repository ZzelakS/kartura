import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { site } from "@/lib/site.config";

export const metadata: Metadata = {
  title: `${site.name} studio`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
