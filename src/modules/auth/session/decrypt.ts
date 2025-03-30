import "server-only";
import { jwtVerify } from "jose";
import { SessionPayload } from "./types";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}
