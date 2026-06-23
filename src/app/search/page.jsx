import Image from "next/image";
import DonorSearchForm from "@/components/search/DonorSearchForm";
import { searchDonors } from "@/lib/actions/platform";

export default async function SearchPage({ searchParams }) {
  const query=await searchParams; const searched=query.searched==="1"; const initial={bloodGroup:query.bloodGroup||"",district:query.district||"",upazila:query.upazila||""}; const donors=searched?await searchDonors(initial):[];
  return <main className="mx-auto w-full max-w-7xl px-4 py-12"><h1 className="mb-8 text-center text-3xl font-extrabold dark:text-white">Search Blood Donors</h1><DonorSearchForm initial={initial}/>{searched&&<section className="mt-8"><h2 className="text-xl font-bold dark:text-white">Search Results ({donors.length})</h2>{donors.length?<div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{donors.map(d=><article key={d.id} className="flex items-center gap-4 rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><Image src={d.image||"/images/default_profile.jpg"} alt={d.name} width={64} height={64} className="h-16 w-16 rounded-full object-cover"/><div><h3 className="font-bold dark:text-white">{d.name}</h3><p className="text-sm text-gray-500">{d.email}</p><p className="mt-1 text-sm font-semibold text-danger">{d.bloodGroup} · {d.upazila}, {d.district}</p></div></article>)}</div>:<p className="py-12 text-center text-gray-500">No active donors matched your search.</p>}</section>}</main>;
}
