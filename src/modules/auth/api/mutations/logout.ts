"use server";

import { deleteSession } from "../../session";
import { redirect } from "next/navigation";

export async function logout() {
  await deleteSession();
  redirect("/login");
}
