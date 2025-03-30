import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
