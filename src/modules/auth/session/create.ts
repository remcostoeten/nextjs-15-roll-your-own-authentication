import "server-only";
import { cookies } from "next/headers";
import { encrypt } from "./encrypt";

export async function createSession(userId: number) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return session;
}
