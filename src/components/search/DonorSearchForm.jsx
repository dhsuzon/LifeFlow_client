"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { districts, upazilas } from "@/data/bdgeoData";
import { bloodGroups } from "@/data/bloodGroups";

export default function DonorSearchForm({ initial = {} }) {
  const router=useRouter(); const [bloodGroup,setBlood]=useState(initial.bloodGroup||""); const [district,setDistrict]=useState(initial.district||""); const [upazila,setUpazila]=useState(initial.upazila||"");
  const list=useMemo(()=>{const d=districts.find(x=>x.name===district); return d?upazilas.filter(x=>String(x.district_id)===String(d.id)):[]},[district]);
  const submit=(e)=>{e.preventDefault(); const p=new URLSearchParams({bloodGroup,district,upazila,searched:"1"}); router.push(`/search?${p}`)};
  const cls="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white";
  return <form onSubmit={submit} className="grid gap-4 rounded-2xl border bg-white p-5 shadow dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-4"><label className="text-sm font-bold dark:text-gray-200">Blood Group<select required value={bloodGroup} onChange={e=>setBlood(e.target.value)} className={`${cls} mt-1`}><option value="">Select</option>{bloodGroups.map(x=><option key={x.name}>{x.name}</option>)}</select></label><label className="text-sm font-bold dark:text-gray-200">District<select required value={district} onChange={e=>{setDistrict(e.target.value);setUpazila("")}} className={`${cls} mt-1`}><option value="">Select</option>{districts.map(x=><option key={x.name}>{x.name}</option>)}</select></label><label className="text-sm font-bold dark:text-gray-200">Upazila<select required disabled={!district} value={upazila} onChange={e=>setUpazila(e.target.value)} className={`${cls} mt-1`}><option value="">Select</option>{list.map(x=><option key={x.name}>{x.name}</option>)}</select></label><button className="self-end rounded-lg bg-danger px-4 py-2 font-bold text-white">Search Donors</button></form>;
}
