"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { confirmDonation } from "@/lib/actions/platform";

export default function DonateButton({ requestId, user, status }) {
  const [open,setOpen]=useState(false); const [busy,setBusy]=useState(false); const router=useRouter();
  if(status!=="pending") return null;
  const confirm=async()=>{setBusy(true); const result=await confirmDonation(requestId); setBusy(false); if(!result.success)return toast.error(result.error); toast.success("Donation confirmed."); setOpen(false); router.refresh();};
  return <><button onClick={()=>setOpen(true)} className="mt-6 rounded-lg bg-danger px-6 py-3 font-bold text-white">Donate Blood</button>{open&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900"><h2 className="text-xl font-bold dark:text-white">Confirm Donation</h2><label className="mt-4 block text-sm font-semibold dark:text-gray-200">Donor Name<input readOnly value={user.name} className="mt-1 w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/></label><label className="mt-4 block text-sm font-semibold dark:text-gray-200">Donor Email<input readOnly value={user.email} className="mt-1 w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/></label><div className="mt-6 flex justify-end gap-3"><button onClick={()=>setOpen(false)} className="rounded-lg border px-4 py-2 dark:border-gray-700 dark:text-white">Cancel</button><button disabled={busy} onClick={confirm} className="rounded-lg bg-danger px-4 py-2 font-bold text-white disabled:opacity-50">{busy?"Confirming...":"Confirm Donation"}</button></div></div></div>}</>;
}
