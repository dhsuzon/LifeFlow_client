"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api-client";
import RequestActions from "@/components/donation-request/RequestActions";

export default function ManagedRequestActions({ request, role, onChanged }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const change = async (event) => {
    setBusy(true);
    const { response, data } = await apiRequest(`/api/admin/requests/${request.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: event.target.value }),
    });
    setBusy(false);
    if (!response.ok) return toast.error(data.error || "Unable to update status.");
    toast.success("Status updated.");
    if (onChanged) onChanged();
    else router.refresh();
  };

  if (role === "admin") return <RequestActions requestId={request.id} status={request.donationStatus} onChanged={onChanged} />;

  return (
    <select disabled={busy} value={request.donationStatus} onChange={change} className="rounded border bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      {["pending", "inprogress", "done", "canceled"].map((status) => (
        <option key={status}>{status}</option>
      ))}
    </select>
  );
}
