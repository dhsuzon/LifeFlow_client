"use client";

import { useCallback, useEffect, useState } from "react";
import ManagedRequestActions from "@/components/admin/ManagedRequestActions";
import { apiRequest } from "@/lib/api-client";

const emptyPagination = { currentPage: 1, totalPages: 1, totalItems: 0 };

export default function AllRequestsPage() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState("volunteer");
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status, page: String(page) });
    const { response, data } = await apiRequest(`/api/admin/requests?${params}`);
    if (response.ok) {
      setRequests(data.requests || []);
      setRole(data.role || "volunteer");
      setPagination(data.pagination || emptyPagination);
    } else {
      setRequests([]);
      setPagination(emptyPagination);
    }
    setLoading(false);
  }, [status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const onFilter = (event) => {
    event.preventDefault();
    setPage(1);
    setStatus(new FormData(event.currentTarget).get("status") || "all");
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold dark:text-white">All Donation Requests</h1>
          <p className="text-sm text-gray-500">Total: {pagination.totalItems}</p>
        </div>
        <form onSubmit={onFilter} className="flex gap-2">
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All</option>
            {["pending", "inprogress", "done", "canceled"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <button className="rounded-lg bg-danger px-4 py-2 font-bold text-white">Filter</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-gray-100 text-xs uppercase dark:bg-gray-800 dark:text-gray-300">
            <tr>
              {["Recipient", "Location", "Blood", "Date", "Time", "Status", "Donor", "Actions"].map((label) => (
                <th key={label} className="px-4 py-3">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">Loading requests...</td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="dark:text-gray-200">
                  <td className="px-4 py-3 font-semibold">{request.recipientName}</td>
                  <td className="px-4 py-3">{request.recipientUpazila}, {request.recipientDistrict}</td>
                  <td className="px-4 py-3 font-bold text-danger">{request.bloodGroup}</td>
                  <td className="px-4 py-3">{request.donationDate}</td>
                  <td className="px-4 py-3">{request.donationTime}</td>
                  <td className="px-4 py-3 capitalize">{request.donationStatus}</td>
                  <td className="px-4 py-3">
                    {request.donorName ? (
                      <>
                        <b>{request.donorName}</b>
                        <br />
                        <small>{request.donorEmail}</small>
                      </>
                    ) : (
                      "Not assigned"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ManagedRequestActions request={request} role={role} onChanged={load} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <nav className="mt-5 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, index) => {
            const value = index + 1;
            return (
              <button
                key={value}
                onClick={() => setPage(value)}
                className={`rounded border px-3 py-2 ${
                  pagination.currentPage === value
                    ? "bg-danger text-white"
                    : "dark:border-gray-700 dark:text-white"
                }`}
              >
                {value}
              </button>
            );
          })}
        </nav>
      )}
    </section>
  );
}
