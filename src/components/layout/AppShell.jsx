"use client";

import { usePathname } from "next/navigation";

const AppShell = ({ navbar, footer, children }) => {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboard) return children;

  return (
    <>
      {navbar}
      <div className="flex-1">{children}</div>
      {footer}
    </>
  );
};

export default AppShell;
