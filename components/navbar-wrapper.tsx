"use client";

import { usePathname } from "next/navigation";
import { ResponsiveNavbar } from "@/components/responsive-navbar";

export function NavbarWrapper() {
  const pathname = usePathname();

  // Don't show navbar on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return <ResponsiveNavbar />;
}
