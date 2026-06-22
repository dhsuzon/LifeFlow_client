import SidebarDrawer from "@/components/dashboardsidebaritem/SidebarDrawer";
import { getLoggedSessionUser } from "@/lib/actions/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await getLoggedSessionUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="flex min-h-dvh bg-default-50">
      <SidebarDrawer role={user.role} />

      <main className="min-w-0 flex-1 p-3 pt-20 sm:p-5 sm:pt-20 md:ml-64 md:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
