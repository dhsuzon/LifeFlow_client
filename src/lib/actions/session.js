"use server";
import { headers } from "next/headers";
import { auth } from "../auth";

export const getLoggedSessionUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
};
