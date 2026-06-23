"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const adminUser = async () => (await auth.api.getSession({ headers: await headers() }))?.user;
export async function getAllUsers({ status = "all", page = 1, pageSize = 10 } = {}) {
  const admin=await adminUser(); if(admin?.role!=="admin") return null;
  const selectedStatus=["active","blocked"].includes(status)?status:"all"; const query=selectedStatus==="all"?{}:{status:selectedStatus}; const size=Math.min(Number(pageSize)||10,20); const collection=db.collection("user"); const totalItems=await collection.countDocuments(query); const totalPages=Math.max(Math.ceil(totalItems/size),1); const currentPage=Math.min(Math.max(parseInt(page,10)||1,1),totalPages); const docs=await collection.find(query,{projection:{password:0}}).sort({createdAt:-1,_id:-1}).skip((currentPage-1)*size).limit(size).toArray();
  return {selectedStatus,users:docs.map(u=>({id:u.id||u._id.toString(),name:u.name,email:u.email,image:u.image||"",role:u.role||"donor",status:u.status||"active"})),pagination:{totalItems,totalPages,currentPage}};
}
export async function updateUserAccess(userId, update) {
  const admin=await adminUser(); if(admin?.role!=="admin") return {success:false,error:"Forbidden."};
  const set={}; if(["active","blocked"].includes(update?.status))set.status=update.status; if(["donor","volunteer","admin"].includes(update?.role))set.role=update.role; if(!Object.keys(set).length)return {success:false,error:"Invalid update."}; if(userId===admin.id&&set.status==="blocked")return {success:false,error:"You cannot block your own account."};
  const idQuery=ObjectId.isValid(userId)?{$or:[{id:userId},{_id:new ObjectId(userId)}]}:{id:userId}; const result=await db.collection("user").updateOne(idQuery,{$set:{...set,updatedAt:new Date()}}); if(!result.matchedCount)return {success:false,error:"User not found."}; revalidatePath("/dashboard/all-users"); return {success:true};
}
