"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api-client";

const RequestActions = ({ requestId, status, onChanged }) => {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const afterChange = () => {
    if (onChanged) onChanged();
    else router.refresh();
  };

  const changeStatus = async (nextStatus) => {
    setIsBusy(true);
    const { response, data } = await apiRequest(`/api/donation-requests/${requestId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });
    setIsBusy(false);
    if (!response.ok) return toast.error(data.error || "Unable to update request.");
    toast.success(`Request marked ${nextStatus}.`);
    afterChange();
  };

  const removeRequest = async () => {
    setIsBusy(true);
    const { response, data } = await apiRequest(`/api/donation-requests/${requestId}`, {
      method: "DELETE",
    });
    setIsBusy(false);
    setShowDeleteModal(false);
    if (!response.ok) return toast.error(data.error || "Unable to delete request.");
    toast.success("Donation request deleted.");
    afterChange();
  };

  return (
    <>
      <div className="flex min-w-48 flex-wrap gap-2">
        {status === "inprogress" && (
          <>
            <button disabled={isBusy} onClick={() => changeStatus("done")} className="rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white disabled:opacity-50">Done</button>
            <button disabled={isBusy} onClick={() => changeStatus("canceled")} className="rounded bg-amber-600 px-2 py-1 text-xs font-bold text-white disabled:opacity-50">Cancel</button>
          </>
        )}
        <Link href={`/dashboard/update-donation-request/${requestId}`} className="rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white">Edit</Link>
        <button disabled={isBusy} onClick={() => setShowDeleteModal(true)} className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white disabled:opacity-50">Delete</button>
        <Link href={`/dashboard/donation-request/${requestId}`} className="rounded bg-gray-700 px-2 py-1 text-xs font-bold text-white">View</Link>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <h2 id="delete-title" className="text-xl font-bold text-gray-900 dark:text-white">Delete donation request?</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button disabled={isBusy} onClick={() => setShowDeleteModal(false)} className="rounded-lg border px-4 py-2 text-sm dark:border-gray-700 dark:text-white">Keep Request</button>
              <button disabled={isBusy} onClick={removeRequest} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{isBusy ? "Deleting..." : "Confirm Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestActions;
