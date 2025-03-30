import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function setSessionCookie(session: string) {
  const cookieStore = cookies();
  const sessionCookie: ResponseCookie = {
    name: "session",
    value: session,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };
  (await cookieStore).set(sessionCookie);
}

export async function removeSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
