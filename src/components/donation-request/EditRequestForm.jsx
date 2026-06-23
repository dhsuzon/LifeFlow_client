"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateMyDonationRequest } from "@/lib/actions/donation-request";
import { districts, upazilas } from "@/data/bdgeoData";
import { bloodGroups } from "@/data/bloodGroups";

const EditRequestForm = ({ request }) => {
  const router = useRouter();
  const [data, setData] = useState(request);
  const [busy, setBusy] = useState(false);
  const filteredUpazilas = useMemo(() => {
    const district = districts.find((item) => item.name === data.recipientDistrict);
    return district ? upazilas.filter((item) => String(item.district_id) === String(district.id)) : [];
  }, [data.recipientDistrict]);
  const set = (field, value) => setData((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    const result = await updateMyDonationRequest(request.id, data);
    setBusy(false);
    if (!result.success) return toast.error(result.error);
    toast.success("Donation request updated.");
    router.push("/dashboard/my-donation-requests");
    router.refresh();
  };

  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white";
  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-5 rounded-2xl border bg-white p-5 shadow dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-2 sm:p-8">
      <h1 className="sm:col-span-2 text-2xl font-extrabold dark:text-white">Update Donation Request</h1>
      <label className="text-sm font-semibold dark:text-gray-200">Recipient Name<input required className={`${inputClass} mt-1`} value={data.recipientName} onChange={(e) => set("recipientName", e.target.value)} /></label>
      <label className="text-sm font-semibold dark:text-gray-200">Blood Group<select required className={`${inputClass} mt-1`} value={data.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>{bloodGroups.map((g) => <option key={g.name}>{g.name}</option>)}</select></label>
      <label className="text-sm font-semibold dark:text-gray-200">District<select required className={`${inputClass} mt-1`} value={data.recipientDistrict} onChange={(e) => setData((c) => ({...c, recipientDistrict:e.target.value, recipientUpazila:""}))}>{districts.map((d) => <option key={d.name}>{d.name}</option>)}</select></label>
      <label className="text-sm font-semibold dark:text-gray-200">Upazila<select required className={`${inputClass} mt-1`} value={data.recipientUpazila} onChange={(e) => set("recipientUpazila", e.target.value)}><option value="">Select Upazila</option>{filteredUpazilas.map((u) => <option key={u.name}>{u.name}</option>)}</select></label>
      <label className="text-sm font-semibold dark:text-gray-200">Hospital Name<input required className={`${inputClass} mt-1`} value={data.hospitalName} onChange={(e) => set("hospitalName", e.target.value)} /></label>
      <label className="text-sm font-semibold dark:text-gray-200">Full Address<input required className={`${inputClass} mt-1`} value={data.fullAddress} onChange={(e) => set("fullAddress", e.target.value)} /></label>
      <label className="text-sm font-semibold dark:text-gray-200">Donation Date<input required type="date" className={`${inputClass} mt-1`} value={data.donationDate} onChange={(e) => set("donationDate", e.target.value)} /></label>
      <label className="text-sm font-semibold dark:text-gray-200">Donation Time<input required type="time" className={`${inputClass} mt-1`} value={data.donationTime.slice(0,5)} onChange={(e) => set("donationTime", e.target.value)} /></label>
      <label className="text-sm font-semibold dark:text-gray-200 sm:col-span-2">Request Message<textarea required rows={5} className={`${inputClass} mt-1`} value={data.requestMessage} onChange={(e) => set("requestMessage", e.target.value)} /></label>
      <div className="sm:col-span-2 flex justify-end"><button disabled={busy} className="rounded-lg bg-danger px-5 py-2.5 font-bold text-white disabled:opacity-50">{busy ? "Updating..." : "Update Donation Request"}</button></div>
    </form>
  );
};

export default EditRequestForm;
