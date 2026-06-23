import { notFound } from "next/navigation";
import { getMyDonationRequest } from "@/lib/actions/donation-request";
import EditRequestForm from "@/components/donation-request/EditRequestForm";
import { getLoggedSessionUser } from "@/lib/actions/session";

export default async function UpdateDonationRequestPage({ params }) {
  const { id } = await params;
  const user = await getLoggedSessionUser();
  if (user?.role === "volunteer") notFound();
  const request = await getMyDonationRequest(id);
  if (!request) notFound();
  return <EditRequestForm request={request} />;
}
