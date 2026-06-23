import Link from "next/link";
import { getPendingDonationRequests } from "@/lib/actions/platform";

export default async function DonationRequestsPage({ searchParams }) {
  const query = await searchParams;
  const { requests, pagination } = await getPendingDonationRequests({ page: query.page });
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-center text-3xl font-extrabold dark:text-white">Pending Blood Donation Requests</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((r) => (
          <article key={r.id} className="flex flex-col rounded-2xl border bg-white p-5 shadow dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between"><h2 className="text-xl font-bold dark:text-white">{r.recipientName}</h2><span className="rounded-full bg-red-100 px-3 py-1 text-sm font-extrabold text-red-700 dark:bg-red-950 dark:text-red-300">{r.bloodGroup}</span></div>
            <dl className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300"><div><dt className="font-bold">Location</dt><dd>{r.recipientUpazila}, {r.recipientDistrict}</dd></div><div><dt className="font-bold">Date & Time</dt><dd>{r.donationDate} at {r.donationTime}</dd></div></dl>
            <Link href={`/donation-requests/${r.id}`} className="mt-5 rounded-lg bg-danger px-4 py-2 text-center font-bold text-white">View Details</Link>
          </article>
        ))}
      </div>
      {!requests.length && <p className="py-16 text-center text-gray-500">No pending requests are available.</p>}
      {pagination.totalPages > 1 && <nav className="mt-8 flex justify-center gap-2">{Array.from({length:pagination.totalPages},(_,i)=><Link key={i+1} href={`/donation-requests?page=${i+1}`} className={`rounded-lg border px-4 py-2 ${pagination.currentPage===i+1?"bg-danger text-white":"dark:border-gray-700 dark:text-white"}`}>{i+1}</Link>)}</nav>}
    </main>
  );
}
