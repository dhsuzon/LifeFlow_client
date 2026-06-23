"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import UserActions from "@/components/admin/UserActions";
import { apiRequest } from "@/lib/api-client";

const emptyPagination = { currentPage: 1, totalPages: 1, totalItems: 0 };

export default function AllUsersPage() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status, page: String(page) });
    const { response, data } = await apiRequest(`/api/admin/users?${params}`);
    if (response.ok) {
      setUsers(data.users || []);
      setPagination(data.pagination || emptyPagination);
    } else {
      setUsers([]);
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
          <h1 className="text-3xl font-extrabold dark:text-white">All Users</h1>
          <p className="text-sm text-gray-500">Total users: {pagination.totalItems}</p>
        </div>
        <form onSubmit={onFilter} className="flex gap-2">
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <button className="rounded-lg bg-danger px-4 py-2 font-bold text-white">Filter</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-100 text-xs uppercase dark:bg-gray-800 dark:text-gray-300">
            <tr>
              {["Avatar", "Name", "Email", "Role", "Status", "Actions"].map((label) => (
                <th key={label} className="px-4 py-3">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">Loading users...</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="dark:text-gray-200">
                  <td className="px-4 py-3">
                    <Image
                      src={user.image || "/images/default_profile.jpg"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3 capitalize">{user.status}</td>
                  <td className="px-4 py-3">
                    <UserActions user={user} onChanged={load} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-5 flex justify-center gap-2">
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
        </div>
      )}
    </section>
  );
}
