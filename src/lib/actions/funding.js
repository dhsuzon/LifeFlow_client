"use server";
import { headers } from "next/headers"; import { auth } from "@/lib/auth"; import { db } from "@/lib/db";
export async function getFundingRecords(){const user=(await auth.api.getSession({headers:await headers()}))?.user;if(!user)return null;const records=await db.collection("funds").find().sort({fundingDate:-1,_id:-1}).limit(100).toArray();return records.map(f=>({id:f._id.toString(),userName:f.userName,amount:f.amount,fundingDate:f.fundingDate?.toISOString?.()||""}))}
