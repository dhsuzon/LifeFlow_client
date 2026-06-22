"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bloodGroups } from "@/data/bloodGroups";
import { districts, upazilas } from "@/data/bdgeoData";

const allowedBloodGroups = new Set(bloodGroups.map((group) => group.name));
const allowedStatuses = new Set([
  "pending",
  "inprogress",
  "done",
  "canceled",
]);

const clean = (value) => (typeof value === "string" ? value.trim() : "");

export async function createDonationRequest(input) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "You must be logged in." };
  }

  if (session.user.status !== "active") {
    return {
      success: false,
      error: "Only active users can create donation requests.",
    };
  }

  const request = {
    recipientName: clean(input?.recipientName),
    recipientDistrict: clean(input?.recipientDistrict),
    recipientUpazila: clean(input?.recipientUpazila),
    hospitalName: clean(input?.hospitalName),
    fullAddress: clean(input?.fullAddress),
    bloodGroup: clean(input?.bloodGroup),
    donationDate: clean(input?.donationDate),
    donationTime: clean(input?.donationTime),
    requestMessage: clean(input?.requestMessage),
  };

  if (Object.values(request).some((value) => !value)) {
    return { success: false, error: "Please complete every required field." };
  }

  if (!allowedBloodGroups.has(request.bloodGroup)) {
    return { success: false, error: "Please select a valid blood group." };
  }

  const district = districts.find(
    (item) => item.name === request.recipientDistrict,
  );
  const validUpazila =
    district &&
    upazilas.some(
      (item) =>
        item.name === request.recipientUpazila &&
        String(item.district_id) === String(district.id),
    );

  if (!district || !validUpazila) {
    return { success: false, error: "Please select a valid district and upazila." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(request.donationDate)) {
    return { success: false, error: "Please select a valid donation date." };
  }

  if (!/^\d{2}:\d{2}(?::\d{2})?$/.test(request.donationTime)) {
    return { success: false, error: "Please select a valid donation time." };
  }

  const now = new Date();
  const result = await db.collection("donationRequests").insertOne({
    requesterId: session.user.id,
    requesterName: session.user.name,
    requesterEmail: session.user.email,
    ...request,
    donationStatus: "pending",
    createdAt: now,
    updatedAt: now,
  });

  return { success: true, requestId: result.insertedId.toString() };
}

export async function getMyDonationRequests({
  status = "all",
  page = 1,
  pageSize = 5,
} = {}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "You must be logged in." };
  }

  const selectedStatus = allowedStatuses.has(status) ? status : "all";
  const safePageSize = Math.min(Math.max(Number(pageSize) || 5, 1), 20);
  const requestedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const ownerQuery = {
    $or: [
      { requesterId: session.user.id },
      { requesterEmail: session.user.email },
    ],
  };
  const query =
    selectedStatus === "all"
      ? ownerQuery
      : {
          $and: [
            ownerQuery,
            {
              $or: [
                { donationStatus: selectedStatus },
                { status: selectedStatus },
              ],
            },
          ],
        };

  const collection = db.collection("donationRequests");
  const totalItems = await collection.countDocuments(query);
  const totalPages = Math.max(Math.ceil(totalItems / safePageSize), 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const documents = await collection
    .find(query)
    .sort({ createdAt: -1, _id: -1 })
    .skip((currentPage - 1) * safePageSize)
    .limit(safePageSize)
    .toArray();

  const requests = documents.map((request) => ({
    id: request._id.toString(),
    recipientName: request.recipientName || "—",
    recipientDistrict: request.recipientDistrict || "—",
    recipientUpazila: request.recipientUpazila || "—",
    hospitalName: request.hospitalName || "—",
    bloodGroup: request.bloodGroup || "—",
    donationDate: request.donationDate || "—",
    donationTime: request.donationTime || "—",
    donationStatus: request.donationStatus || request.status || "pending",
    donorName: request.donorName || "",
    donorEmail: request.donorEmail || "",
  }));

  return {
    success: true,
    requests,
    selectedStatus,
    pagination: {
      currentPage,
      pageSize: safePageSize,
      totalItems,
      totalPages,
    },
  };
}

const getSessionAndOwner = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  return {
    session,
    ownerQuery: {
      $or: [
        { requesterId: session.user.id },
        { requesterEmail: session.user.email },
      ],
    },
  };
};

export async function updateMyDonationStatus(requestId, nextStatus) {
  const context = await getSessionAndOwner();
  if (!context) return { success: false, error: "Unauthorized." };
  if (!ObjectId.isValid(requestId) || !["done", "canceled"].includes(nextStatus)) {
    return { success: false, error: "Invalid status update." };
  }

  const statusQuery = context.session.user.role === "admin"
    ? { _id: new ObjectId(requestId), donationStatus: "inprogress" }
    : {
      $and: [
        { _id: new ObjectId(requestId) },
        context.ownerQuery,
        { donationStatus: "inprogress" },
      ],
    };
  const result = await db.collection("donationRequests").updateOne(
    statusQuery,
    { $set: { donationStatus: nextStatus, updatedAt: new Date() } },
  );

  if (!result.modifiedCount) {
    return { success: false, error: "Only in-progress requests can be updated." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-donation-requests");
  return { success: true };
}

export async function deleteMyDonationRequest(requestId) {
  const context = await getSessionAndOwner();
  if (!context) return { success: false, error: "Unauthorized." };
  if (!ObjectId.isValid(requestId)) {
    return { success: false, error: "Invalid request." };
  }
  if (context.session.user.role === "volunteer") return { success: false, error: "Forbidden." };
  const deleteQuery = context.session.user.role === "admin"
    ? { _id: new ObjectId(requestId) }
    : { $and: [{ _id: new ObjectId(requestId) }, context.ownerQuery] };
  const result = await db.collection("donationRequests").deleteOne(deleteQuery);
  if (!result.deletedCount) return { success: false, error: "Request not found." };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-donation-requests");
  return { success: true };
}

export async function getMyDonationRequest(requestId) {
  const context = await getSessionAndOwner();
  if (!context || !ObjectId.isValid(requestId)) return null;
  const canManageAll = ["admin", "volunteer"].includes(context.session.user.role);
  const request = await db.collection("donationRequests").findOne(canManageAll
    ? { _id: new ObjectId(requestId) }
    : { $and: [{ _id: new ObjectId(requestId) }, context.ownerQuery] });
  if (!request) return null;
  return {
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
    createdAt: request.createdAt?.toISOString?.() || "",
    updatedAt: request.updatedAt?.toISOString?.() || "",
  };
}

export async function updateMyDonationRequest(requestId, input) {
  const context = await getSessionAndOwner();
  if (!context) return { success: false, error: "Unauthorized." };
  if (context.session.user.role === "volunteer") return { success: false, error: "Forbidden." };
  if (!ObjectId.isValid(requestId)) return { success: false, error: "Invalid request." };

  const update = {
    recipientName: clean(input?.recipientName),
    recipientDistrict: clean(input?.recipientDistrict),
    recipientUpazila: clean(input?.recipientUpazila),
    hospitalName: clean(input?.hospitalName),
    fullAddress: clean(input?.fullAddress),
    bloodGroup: clean(input?.bloodGroup),
    donationDate: clean(input?.donationDate),
    donationTime: clean(input?.donationTime),
    requestMessage: clean(input?.requestMessage),
  };
  if (Object.values(update).some((value) => !value)) {
    return { success: false, error: "Please complete every required field." };
  }
  if (!allowedBloodGroups.has(update.bloodGroup)) {
    return { success: false, error: "Invalid blood group." };
  }
  const district = districts.find((item) => item.name === update.recipientDistrict);
  const validUpazila = district && upazilas.some((item) =>
    item.name === update.recipientUpazila && String(item.district_id) === String(district.id));
  if (!validUpazila) return { success: false, error: "Invalid location." };

  const updateQuery = context.session.user.role === "admin"
    ? { _id: new ObjectId(requestId) }
    : { $and: [{ _id: new ObjectId(requestId) }, context.ownerQuery] };
  const result = await db.collection("donationRequests").updateOne(
    updateQuery,
    { $set: { ...update, updatedAt: new Date() } },
  );
  if (!result.matchedCount) return { success: false, error: "Request not found." };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-donation-requests");
  revalidatePath(`/dashboard/donation-request/${requestId}`);
  return { success: true };
}
