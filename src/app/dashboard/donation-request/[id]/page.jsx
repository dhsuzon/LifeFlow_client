"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

const labels = {
  requesterName: "Requester Name",
  requesterEmail: "Requester Email",
  recipientName: "Recipient Name",
  recipientDistrict: "District",
  recipientUpazila: "Upazila",
  hospitalName: "Hospital",
  fullAddress: "Full Address",
  bloodGroup: "Blood Group",
  donationDate: "Donation Date",
  donationTime: "Donation Time",
  donationStatus: "Status",
  donorName: "Donor Name",
  donorEmail: "Donor Email",
};

export default function DonationRequestDetailsPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest(`/api/donation-requests/${id}`).then(({ response, data }) => {
      setRequest(response.ok ? data.request : null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-12 text-center text-gray-500 dark:text-gray-300">Loading details...</div>;
  if (!request) return <div className="p-12 text-center text-gray-500 dark:text-gray-300">Request not found.</div>;

  return (
    <article className="rounded-2xl border bg-white p-5 shadow dark:border-gray-800 dark:bg-gray-900 sm:p-8">
      <h1 className="text-2xl font-extrabold dark:text-white">Donation Request Details</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-white">{request[key] || "Not assigned"}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
        <p className="text-xs font-bold uppercase text-gray-500">Request Message</p>
        <p className="mt-2 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{request.requestMessage}</p>
      </div>
    </article>
  );
}
