import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./decrypt";

export async function verifySession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: Number(session.userId) };
}
