"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DonateButton from "@/components/donation-request/DonateButton";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api-client";

export default function DonationRequestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace(`/auth/login?callbackURL=/donation-requests/${id}`);
      return;
    }
    apiRequest(`/api/public-requests/${id}`).then(({ response, data }) => {
      setRequest(response.ok ? data.request : null);
      setLoading(false);
    });
  }, [id, isPending, session?.user, router]);

  if (isPending || loading) {
    return <div className="p-12 text-center text-gray-500 dark:text-gray-300">Loading details...</div>;
  }
  if (!session?.user) return null;
  if (!request) {
    return <div className="p-12 text-center text-gray-500 dark:text-gray-300">Request not found.</div>;
  }

  const fields = [
    ["Recipient", request.recipientName],
    ["Location", `${request.recipientUpazila}, ${request.recipientDistrict}`],
    ["Hospital", request.hospitalName],
    ["Full Address", request.fullAddress],
    ["Blood Group", request.bloodGroup],
    ["Donation Date", request.donationDate],
    ["Donation Time", request.donationTime],
    ["Requester", request.requesterName],
    ["Requester Email", request.requesterEmail],
    ["Status", request.donationStatus],
  ];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <article className="rounded-3xl border bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h1 className="text-3xl font-extrabold dark:text-white">Donation Request Details</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
              <p className="mt-1 font-semibold dark:text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-xs font-bold uppercase text-gray-500">Request Message</p>
          <p className="mt-2 whitespace-pre-wrap dark:text-gray-200">{request.requestMessage}</p>
        </div>
        <DonateButton requestId={id} user={session.user} status={request.donationStatus} />
      </article>
    </main>
  );
}
