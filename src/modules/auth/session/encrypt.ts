import "server-only";
import { SignJWT } from "jose";
import { SessionPayload } from "./types";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
}
