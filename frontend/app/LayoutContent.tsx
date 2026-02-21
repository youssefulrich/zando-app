"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages spécifiques sans navbar
  const hideNavbarRoutes = ["/login", "/register"];

  const shouldHideNavbar =
    hideNavbarRoutes.includes(pathname) ||
    pathname.startsWith("/owner");

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}
