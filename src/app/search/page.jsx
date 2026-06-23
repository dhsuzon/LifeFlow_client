"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import DonorSearchForm from "@/components/search/DonorSearchForm";
import { apiRequest } from "@/lib/api-client";

function SearchContent() {
  const query = useSearchParams();
  const searched = query.get("searched") === "1";
  const bloodGroup = query.get("bloodGroup") || "";
  const district = query.get("district") || "";
  const upazila = query.get("upazila") || "";
  const initial = { bloodGroup, district, upazila };

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searched) {
      setDonors([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({ bloodGroup, district, upazila });
    apiRequest(`/api/donation-requests/search/donors?${params}`).then(({ response, data }) => {
      setDonors(response.ok ? data.donors || [] : []);
      setLoading(false);
    });
  }, [searched, bloodGroup, district, upazila]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-extrabold dark:text-white">Search Blood Donors</h1>
      <DonorSearchForm initial={initial} />
      {searched && (
        <section className="mt-8">
          <h2 className="text-xl font-bold dark:text-white">
            Search Results ({loading ? "..." : donors.length})
          </h2>
          {loading ? (
            <p className="py-12 text-center text-gray-500">Searching donors...</p>
          ) : donors.length ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {donors.map((donor) => (
                <article
                  key={donor.id}
                  className="flex items-center gap-4 rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
                >
                  <Image
                    src={donor.image || "/images/default_profile.jpg"}
                    alt={donor.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold dark:text-white">{donor.name}</h3>
                    <p className="text-sm text-gray-500">{donor.email}</p>
                    <p className="mt-1 text-sm font-semibold text-danger">
                      {donor.bloodGroup} · {donor.upazila}, {donor.district}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-gray-500">No active donors matched your search.</p>
          )}
        </section>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="mx-auto w-full max-w-7xl px-4 py-12" />}>
      <SearchContent />
    </Suspense>
  );
}
