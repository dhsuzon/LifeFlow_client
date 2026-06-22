import Link from "next/link";
import { redirect } from "next/navigation";
import { getLoggedSessionUser } from "@/lib/actions/session";
import { getMyDonationRequests } from "@/lib/actions/donation-request";
import RequestActions from "@/components/donation-request/RequestActions";
import { getDashboardStats } from "@/lib/actions/platform";
import { FaUsers, FaHandHoldingUsd, FaTint } from "react-icons/fa";

const statusLabels = { pending: "Pending", inprogress: "In Progress", done: "Done", canceled: "Canceled" };

const DashboardHomePage = async () => {
  const user = await getLoggedSessionUser();

  if (!user) redirect("/auth/login");

  if (["admin", "volunteer"].includes(user.role)) {
    const stats = await getDashboardStats();
    const cards = [
      { title: "Total Donors", value: stats?.totalUsers || 0, icon: FaUsers },
      { title: "Total Funding", value: `$${(stats?.totalFunding || 0).toFixed(2)}`, icon: FaHandHoldingUsd },
      { title: "Donation Requests", value: stats?.totalRequests || 0, icon: FaTint },
    ];
    return (
      <div className="mx-auto w-full max-w-7xl">
        <section className="rounded-3xl bg-gradient-to-r from-red-600 to-rose-500 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-100">{user.role} Dashboard</p>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-4xl">Welcome, {user.name}!</h1>
        </section>
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({title,value,icon:Icon})=><article key={title} className="rounded-2xl border bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-900"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-gray-500">{title}</p><p className="mt-2 text-3xl font-extrabold dark:text-white">{value}</p></div><span className="rounded-2xl bg-red-100 p-4 text-2xl text-danger dark:bg-red-950"><Icon/></span></div></article>)}
        </section>
        <section className="mt-8 rounded-2xl border bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-extrabold dark:text-white">Request Status Overview</h2>
          <div className="mt-5 space-y-4">
            {["pending", "inprogress", "done", "canceled"].map((status) => {
              const count = stats?.statusCounts?.[status] || 0;
              const width = stats?.totalRequests ? Math.round((count / stats.totalRequests) * 100) : 0;
              return <div key={status}><div className="mb-1 flex justify-between text-sm capitalize dark:text-gray-200"><span>{status}</span><span>{count}</span></div><div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"><div className="h-full rounded-full bg-danger" style={{width:`${width}%`}} /></div></div>;
            })}
          </div>
        </section>
      </div>
    );
  }

  const result = await getMyDonationRequests({ page: 1, pageSize: 3 });
  const recentRequests = result.success ? result.requests : [];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <section className="rounded-3xl bg-gradient-to-r from-red-600 to-rose-500 p-6 text-white shadow-lg sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-100">
          Donor Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-4xl">
          Welcome, {user.name}!
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-red-100 sm:text-base">
          Manage your blood donation requests and help connect recipients with
          donors.
        </p>
      </section>

      {recentRequests.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                Recent Donation Requests
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your latest three blood donation requests.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    <th className="px-5 py-4">Recipient Name</th>
                    <th className="px-5 py-4">Recipient Location</th>
                    <th className="px-5 py-4">Donation Date</th>
                    <th className="px-5 py-4">Donation Time</th>
                    <th className="px-5 py-4">Blood Group</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Donor Information</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/60"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {request.recipientName}
                      </td>
                      <td className="px-5 py-4">
                        {request.recipientDistrict}, {request.recipientUpazila}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {request.donationDate}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {request.donationTime}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold text-red-700 dark:bg-red-950 dark:text-red-300">
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {statusLabels[request.donationStatus] || request.donationStatus}
                      </td>
                      <td className="px-5 py-4">
                        {request.donorName || request.donorEmail ? (
                          <div><p className="font-semibold">{request.donorName || "Donor"}</p><p className="text-xs text-gray-500">{request.donorEmail}</p></div>
                        ) : <span className="text-gray-400">Not assigned</span>}
                      </td>
                      <td className="px-5 py-4">
                        <RequestActions requestId={request.id} status={request.donationStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-5 text-center">
            <Link href="/dashboard/my-donation-requests" className="inline-flex rounded-lg bg-danger px-5 py-2.5 text-sm font-bold text-white">
              View My All Requests
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardHomePage;
