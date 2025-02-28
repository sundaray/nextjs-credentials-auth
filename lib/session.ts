import "server-only";

import { cookies } from "next/headers";
import { base64url, EncryptJWT } from "jose";

const key = process.env.JWT_ENCRYPTION_KEY ?? "";
const secret = base64url.decode(key);

/************************************************
 *
 * Encrypt payload
 *
 ************************************************/

export async function encrypt(payload: any) {
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setExpirationTime("1hr")
    .encrypt(secret);
}

/************************************************
 *
 * Create session
 *
 ************************************************/

export async function createUserSession(
  userId: string,
  email: string,
  role: string,
) {
  const encryptedUser = await encrypt({ userId, email, role });

  const cookieStore = await cookies();

  cookieStore.set("session", encryptedUser, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour in seconds
    sameSite: "lax",
    path: "/",
  });
}
