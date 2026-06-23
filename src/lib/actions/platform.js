"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bloodGroups } from "@/data/bloodGroups";
import { districts, upazilas } from "@/data/bdgeoData";

const statuses = ["pending", "inprogress", "done", "canceled"];
const serializeRequest = (request) => ({
  id: request._id.toString(),
  requesterName: request.requesterName || "",
  requesterEmail: request.requesterEmail || "",
  recipientName: request.recipientName || "",
  recipientDistrict: request.recipientDistrict || "",
  recipientUpazila: request.recipientUpazila || "",
  hospitalName: request.hospitalName || "",
  fullAddress: request.fullAddress || "",
  bloodGroup: request.bloodGroup || "",
  donationDate: request.donationDate || "",
  donationTime: request.donationTime || "",
  requestMessage: request.requestMessage || "",
  donationStatus: request.donationStatus || request.status || "pending",
  donorName: request.donorName || "",
  donorEmail: request.donorEmail || "",
});

const sessionUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
};

export async function getPendingDonationRequests({ page = 1, pageSize = 9 } = {}) {
  const size = Math.min(Math.max(Number(pageSize) || 9, 1), 24);
  const requestedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const query = { donationStatus: "pending" };
  const collection = db.collection("donationRequests");
  const totalItems = await collection.countDocuments(query);
  const totalPages = Math.max(Math.ceil(totalItems / size), 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const requests = await collection.find(query).sort({ createdAt: -1, _id: -1 })
    .skip((currentPage - 1) * size).limit(size).toArray();
  return { requests: requests.map(serializeRequest), pagination: { currentPage, totalPages, totalItems } };
}

export async function getPrivateDonationRequest(requestId) {
  const user = await sessionUser();
  if (!user || !ObjectId.isValid(requestId)) return null;
  const request = await db.collection("donationRequests").findOne({ _id: new ObjectId(requestId) });
  return request ? { ...serializeRequest(request), currentUser: { name: user.name, email: user.email, status: user.status } } : null;
}

export async function confirmDonation(requestId) {
  const user = await sessionUser();
  if (!user) return { success: false, error: "You must be logged in." };
  if (user.status !== "active") return { success: false, error: "Only active users can donate." };
  if (!ObjectId.isValid(requestId)) return { success: false, error: "Invalid request." };
  const result = await db.collection("donationRequests").updateOne(
    { _id: new ObjectId(requestId), donationStatus: "pending" },
    { $set: { donationStatus: "inprogress", donorName: user.name, donorEmail: user.email, donorId: user.id, updatedAt: new Date() } },
  );
  if (!result.modifiedCount) return { success: false, error: "This request is no longer pending." };
  revalidatePath("/donation-requests");
  revalidatePath(`/donation-requests/${requestId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function searchDonors({ bloodGroup, district, upazila }) {
  const validBlood = bloodGroups.some((item) => item.name === bloodGroup);
  const validDistrict = districts.find((item) => item.name === district);
  const validLocation = validDistrict && upazilas.some((item) => item.name === upazila && String(item.district_id) === String(validDistrict.id));
  if (!validBlood || !validLocation) return [];
  const users = await db.collection("user").find({ role: "donor", status: "active", bloodGroup, district, upazila }, { projection: { name: 1, email: 1, image: 1, bloodGroup: 1, district: 1, upazila: 1 } }).limit(50).toArray();
  return users.map((user) => ({ id: user._id.toString(), name: user.name, email: user.email, image: user.image || "", bloodGroup: user.bloodGroup, district: user.district, upazila: user.upazila }));
}

export async function getDashboardStats() {
  const user = await sessionUser();
  if (!user || !["admin", "volunteer"].includes(user.role)) return null;
  const [totalUsers, totalRequests, funds, statusGroups] = await Promise.all([
    db.collection("user").countDocuments({ role: "donor" }),
    db.collection("donationRequests").countDocuments(),
    db.collection("funds").aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]).toArray(),
    db.collection("donationRequests").aggregate([{ $group: { _id: "$donationStatus", count: { $sum: 1 } } }]).toArray(),
  ]);
  return { totalUsers, totalRequests, totalFunding: funds[0]?.total || 0, statusCounts: Object.fromEntries(statusGroups.map((item) => [item._id, item.count])) };
}

export async function getAllDonationRequests({ status = "all", page = 1, pageSize = 10 } = {}) {
  const user = await sessionUser();
  if (!user || !["admin", "volunteer"].includes(user.role)) return null;
  const selectedStatus = statuses.includes(status) ? status : "all";
  const query = selectedStatus === "all" ? {} : { donationStatus: selectedStatus };
  const size = Math.min(Math.max(Number(pageSize) || 10, 1), 20);
  const totalItems = await db.collection("donationRequests").countDocuments(query);
  const totalPages = Math.max(Math.ceil(totalItems / size), 1);
  const currentPage = Math.min(Math.max(parseInt(page, 10) || 1, 1), totalPages);
  const docs = await db.collection("donationRequests").find(query).sort({ createdAt: -1, _id: -1 }).skip((currentPage - 1) * size).limit(size).toArray();
  return { role: user.role, selectedStatus, requests: docs.map(serializeRequest), pagination: { totalItems, totalPages, currentPage } };
}

export async function setManagedDonationStatus(requestId, status) {
  const user = await sessionUser();
  if (!user || !["admin", "volunteer"].includes(user.role)) return { success: false, error: "Forbidden." };
  if (!ObjectId.isValid(requestId) || !statuses.includes(status)) return { success: false, error: "Invalid update." };
  await db.collection("donationRequests").updateOne({ _id: new ObjectId(requestId) }, { $set: { donationStatus: status, updatedAt: new Date() } });
  revalidatePath("/dashboard/all-blood-donation-request");
  return { success: true };
}
