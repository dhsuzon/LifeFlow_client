import { notFound, redirect } from "next/navigation";
import { getPrivateDonationRequest } from "@/lib/actions/platform";
import DonateButton from "@/components/donation-request/DonateButton";
import { getLoggedSessionUser } from "@/lib/actions/session";

export default async function DonationRequestPage({ params }) {
  const { id } = await params; const user = await getLoggedSessionUser();
  if (!user) redirect(`/auth/login?callbackURL=/donation-requests/${id}`);
  const request = await getPrivateDonationRequest(id);
  if (!request) notFound();
  const fields=[["Recipient",request.recipientName],["Location",`${request.recipientUpazila}, ${request.recipientDistrict}`],["Hospital",request.hospitalName],["Full Address",request.fullAddress],["Blood Group",request.bloodGroup],["Donation Date",request.donationDate],["Donation Time",request.donationTime],["Requester",request.requesterName],["Requester Email",request.requesterEmail],["Status",request.donationStatus]];
  return <main className="mx-auto w-full max-w-4xl px-4 py-12"><article className="rounded-3xl border bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-900 sm:p-8"><h1 className="text-3xl font-extrabold dark:text-white">Donation Request Details</h1><div className="mt-6 grid gap-4 sm:grid-cols-2">{fields.map(([label,value])=><div key={label} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs font-bold uppercase text-gray-500">{label}</p><p className="mt-1 font-semibold dark:text-white">{value}</p></div>)}</div><div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs font-bold uppercase text-gray-500">Request Message</p><p className="mt-2 whitespace-pre-wrap dark:text-gray-200">{request.requestMessage}</p></div><DonateButton requestId={id} user={request.currentUser} status={request.donationStatus}/></article></main>;
}
