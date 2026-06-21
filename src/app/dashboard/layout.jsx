import SidebarDrawer from "@/components/dashboardsidebaritem/SidebarDrawer";
import { getLoggedSessionUser } from "@/lib/actions/session";

export default async function DashboardLayout({ children }) {
  const user = await getLoggedSessionUser();

  return (
    <div className="flex min-h-screen  bg-default-50">
      <SidebarDrawer role={user?.role} />

      <main className="flex-1 md:ml-64  p-4 md:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
