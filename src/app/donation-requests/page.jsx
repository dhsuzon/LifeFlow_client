"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";

const emptyPagination = { currentPage: 1, totalPages: 1, totalItems: 0 };

export default function DonationRequestsPage() {
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiRequest(`/api/donation-requests/public?page=${page}`).then(({ response, data }) => {
      if (response.ok) {
        setRequests(data.requests || []);
        setPagination(data.pagination || emptyPagination);
      } else {
        setRequests([]);
        setPagination(emptyPagination);
      }
      setLoading(false);
    });
  }, [page]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-center text-3xl font-extrabold dark:text-white">Pending Blood Donation Requests</h1>

      {loading ? (
        <p className="py-16 text-center text-gray-500">Loading requests...</p>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <article
                key={request.id}
                className="flex flex-col rounded-2xl border bg-white p-5 shadow dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold dark:text-white">{request.recipientName}</h2>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-extrabold text-red-700 dark:bg-red-950 dark:text-red-300">
                    {request.bloodGroup}
                  </span>
                </div>
                <dl className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div>
                    <dt className="font-bold">Location</dt>
                    <dd>{request.recipientUpazila}, {request.recipientDistrict}</dd>
                  </div>
                  <div>
                    <dt className="font-bold">Date &amp; Time</dt>
                    <dd>{request.donationDate} at {request.donationTime}</dd>
                  </div>
                </dl>
                <Link
                  href={`/donation-requests/${request.id}`}
                  className="mt-5 rounded-lg bg-danger px-4 py-2 text-center font-bold text-white"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>

          {!requests.length && (
            <p className="py-16 text-center text-gray-500">No pending requests are available.</p>
          )}

          {pagination.totalPages > 1 && (
            <nav className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    onClick={() => setPage(value)}
                    className={`rounded-lg border px-4 py-2 ${
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
        </>
      )}
    </main>
  );
}
