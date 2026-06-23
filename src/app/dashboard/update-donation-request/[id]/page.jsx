"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditRequestForm from "@/components/donation-request/EditRequestForm";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api-client";

export default function UpdateDonationRequestPage() {
  const { id } = useParams();
  const { data: session, isPending } = useSession();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest(`/api/donation-requests/${id}`).then(({ response, data }) => {
      setRequest(response.ok ? data.request : null);
      setLoading(false);
    });
  }, [id]);

  if (isPending || loading) {
    return <div className="p-12 text-center text-gray-500 dark:text-gray-300">Loading request...</div>;
  }

  if (session?.user?.role === "volunteer") {
    return <div className="p-12 text-center text-gray-500 dark:text-gray-300">You do not have access to edit requests.</div>;
  }

  if (!request) return <div className="p-12 text-center text-gray-500 dark:text-gray-300">Request not found.</div>;

  return <EditRequestForm request={request} />;
}
