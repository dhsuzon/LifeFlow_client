"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api-client";

export default function UserActions({ user, onChanged }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const run = async (update) => {
    setBusy(true);
    const { response, data } = await apiRequest(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    });
    setBusy(false);
    if (!response.ok) return toast.error(data.error || "Unable to update user.");
    toast.success("User updated.");
    if (onChanged) onChanged();
    else router.refresh();
  };

  return (
    <div className="flex min-w-48 flex-wrap gap-2">
      <button disabled={busy} onClick={() => run({ status: user.status === "active" ? "blocked" : "active" })} className="rounded bg-amber-600 px-2 py-1 text-xs font-bold text-white">
        {user.status === "active" ? "Block" : "Unblock"}
      </button>
      {user.role === "donor" && (
        <button disabled={busy} onClick={() => run({ role: "volunteer" })} className="rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white">
          Make Volunteer
        </button>
      )}
      {user.role !== "admin" && (
        <button disabled={busy} onClick={() => run({ role: "admin" })} className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
          Make Admin
        </button>
      )}
    </div>
  );
}
