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
 * Create user session
 *
 ************************************************/

export async function createUserSession(
  userId: string,
  email: string,
  role: string,
) {
  const sessionData = await encrypt({ userId, email, role });

  const cookieStore = await cookies();

  cookieStore.set("user-session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour in seconds
    sameSite: "lax",
    path: "/",
  });
}

/**
 *
 * Create a session for email verification
 *
 */
export async function createEmailVerificationSession(
  email: string,
  hashedPassword: string,
  token: string,
) {
  try {
    // Encrypt the session data
    const sessionData = await encrypt({
      email,
      hashedPassword,
      token,
    });

    // Set the cookie
    const cookieStore = await cookies();
    cookieStore.set("email-verification-session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("Error creating email verification session:", error);
    throw error;
  }
}
