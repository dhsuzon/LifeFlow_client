import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyDonationRequests } from "@/lib/actions/donation-request";
import RequestActions from "@/components/donation-request/RequestActions";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  inprogress: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  canceled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

const statusLabels = {
  pending: "Pending",
  inprogress: "In Progress",
  done: "Done",
  canceled: "Canceled",
};

const pageHref = (page, status) => {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query
    ? `/dashboard/my-donation-requests?${query}`
    : "/dashboard/my-donation-requests";
};

const MyDonationRequestsPage = async ({ searchParams }) => {
  const query = await searchParams;
  const result = await getMyDonationRequests({
    status: typeof query.status === "string" ? query.status : "all",
    page: typeof query.page === "string" ? query.page : 1,
    pageSize: 5,
  });

  if (!result.success) redirect("/auth/login");

  const { requests, selectedStatus, pagination } = result;

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            My Donation Requests
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Requests created from your account: {pagination.totalItems}
          </p>
        </div>

        <form className="flex w-full items-end gap-2 sm:w-auto">
          <div className="flex-1 sm:min-w-52">
            <label
              htmlFor="status-filter"
              className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Filter by status
            </label>
            <select
              id="status-filter"
              name="status"
              defaultValue={selectedStatus}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-danger dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white"
          >
            Filter
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="px-5 py-4">Recipient</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Hospital</th>
                <th className="px-5 py-4">Blood Group</th>
                <th className="px-5 py-4">Donation Date</th>
                <th className="px-5 py-4">Donation Time</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Donor Information</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {requests.length ? (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/60"
                  >
                    <td className="px-5 py-4 font-semibold">
                      {request.recipientName}
                    </td>
                    <td className="px-5 py-4">
                      {request.recipientUpazila}, {request.recipientDistrict}
                    </td>
                    <td className="max-w-60 px-5 py-4">
                      {request.hospitalName}
                    </td>
                    <td className="px-5 py-4 font-bold text-danger">
                      {request.bloodGroup}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {request.donationDate}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {request.donationTime}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          statusStyles[request.donationStatus] ||
                          statusStyles.pending
                        }`}
                      >
                        {statusLabels[request.donationStatus] ||
                          request.donationStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {request.donorName || request.donorEmail ? (
                        <div>
                          <p className="font-semibold">
                            {request.donorName || "Donor"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {request.donorEmail}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <RequestActions requestId={request.id} status={request.donationStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-14 text-center text-gray-500 dark:text-gray-400"
                  >
                    No donation requests found for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <nav
            aria-label="Donation request pages"
            className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={pageHref(
                  Math.max(pagination.currentPage - 1, 1),
                  selectedStatus,
                )}
                aria-disabled={pagination.currentPage === 1}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                  pagination.currentPage === 1
                    ? "pointer-events-none border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600"
                    : "border-gray-300 text-gray-700 hover:border-danger hover:text-danger dark:border-gray-700 dark:text-gray-200"
                }`}
              >
                Previous
              </Link>

              {Array.from({ length: pagination.totalPages }, (_, index) => {
                const page = index + 1;
                const isActive = page === pagination.currentPage;
                return (
                  <Link
                    key={page}
                    href={pageHref(page, selectedStatus)}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                      isActive
                        ? "border-danger bg-danger text-white"
                        : "border-gray-300 text-gray-700 hover:border-danger hover:text-danger dark:border-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {page}
                  </Link>
                );
              })}

              <Link
                href={pageHref(
                  Math.min(
                    pagination.currentPage + 1,
                    pagination.totalPages,
                  ),
                  selectedStatus,
                )}
                aria-disabled={
                  pagination.currentPage === pagination.totalPages
                }
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                  pagination.currentPage === pagination.totalPages
                    ? "pointer-events-none border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600"
                    : "border-gray-300 text-gray-700 hover:border-danger hover:text-danger dark:border-gray-700 dark:text-gray-200"
                }`}
              >
                Next
              </Link>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
};

export default MyDonationRequestsPage;
