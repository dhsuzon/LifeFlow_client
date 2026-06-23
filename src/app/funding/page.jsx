"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import GiveFundButton from "@/components/funding/GiveFundButton";
import { apiRequest } from "@/lib/api-client";

export default function FundingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      const { response, data } = await apiRequest("/api/funding", { method: "GET" });
      if (!active) return;
      if (!response.ok) {
        setMessage(data.error || "Unable to load funding records.");
        setRecords([]);
      } else {
        setRecords(data.records || []);
        setMessage("");
      }
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [isPending, router, session?.user]);

  if (isPending) {
    return <main className="mx-auto w-full max-w-5xl px-4 py-12 text-center text-gray-500 dark:text-gray-300">Loading...</main>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold dark:text-white">Organization Funding</h1>
          <p className="mt-1 text-gray-500">Community contributions to support blood donation activities.</p>
        </div>
        <GiveFundButton />
      </div>

      {message && <p className="mt-5 rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-950 dark:text-red-200">{message}</p>}

      {!message && loading && <p className="mt-8 text-gray-500 dark:text-gray-300">Loading records...</p>}

      {!message && !loading && (
        <div className="mt-8 overflow-x-auto rounded-2xl border bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="px-5 py-4">Contributor</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Funding Date</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {records.length ? records.map((record) => (
                <tr key={record.id} className="dark:text-gray-200">
                  <td className="px-5 py-4 font-semibold">{record.userName}</td>
                  <td className="px-5 py-4">${Number(record.amount).toFixed(2)}</td>
                  <td className="px-5 py-4">{record.fundingDate ? new Date(record.fundingDate).toLocaleDateString("en-GB") : "—"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-gray-500 dark:text-gray-300">No funding records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
