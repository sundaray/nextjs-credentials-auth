import "server-only";

import { cookies } from "next/headers";
import { base64url, EncryptJWT, jwtDecrypt } from "jose";

const key = process.env.JWT_ENCRYPTION_KEY ?? "";
const secret = base64url.decode(key);

/************************************************
 *
 * Encrypt payload
 *
 ************************************************/

export async function encrypt(payload: any) {
  try {
    const encryptedJWT = await new EncryptJWT(payload)
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
      .setExpirationTime("1hr")
      .encrypt(secret);
    return { encryptedJWT };
  } catch (error) {
    console.log("Failed to encrypt JWT: ", error);
    return { error: "Failed to encrypt JWT." };
  }
}

/************************************************
 *
 * Decrypt JWT
 *
 ************************************************/

export async function decrypt(jwt: string) {
  try {
    const { payload } = await jwtDecrypt(jwt, secret);
    return { payload };
  } catch (error) {
    console.log("Failed to decrypt JWT: ", error);
    return { error: "Failed to decrypt JWT." };
  }
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
  const { encryptedJWT: sessionData, error } = await encrypt({
    userId,
    email,
    role,
  });

  if (!sessionData || error) {
    return { error };
  }

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
 * Create an email verification session
 *
 */
export async function createEmailVerificationSession(
  email: string,
  hashedPassword: string,
  token: string,
) {
  const { encryptedJWT: sessionData, error } = await encrypt({
    email,
    hashedPassword,
    token,
  });

  if (!sessionData || error) {
    return { error };
  }

  const cookieStore = await cookies();
  cookieStore.set("email-verification-session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour in seconds
    sameSite: "lax",
    path: "/",
  });
}

/**
 *
 * Update an existing email verification session
 *
 */
export async function updateEmailVerificationSession(
  email: string,
  hashedPassword: string,
  token: string,
) {
  const { encryptedJWT: sessionData, error } = await encrypt({
    email,
    hashedPassword,
    token,
  });

  if (!sessionData || error) {
    return { error };
  }

  const cookieStore = await cookies();

  cookieStore.set("email-verification-session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour in seconds
    sameSite: "lax",
    path: "/",
  });
}

/**
 *
 * Check if an email verification session exists
 * Returns boolean indicating whether a session exists
 *
 */
export async function doesEmailVerificationSessionExist(): Promise<{
  sessionExists: boolean;
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("email-verification-session");

    return { sessionExists: !!sessionCookie };
  } catch (error) {
    console.error("Error checking email verification session:", error);
    return { error: "Failed to retrive email verification session cookie" };
  }
}

/**
 * Delete the email verification session cookie
 */
export async function deleteEmailVerificationSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("email-verification-session");
  } catch (error) {
    console.error(
      "Failed to delete email verification session cookie: ",
      error,
    );
    return { error: "Failed to delete email verification session cookie." };
  }
}

type SessionPayload = {
  token: string;
  email: string;
  hashedPassword: string;
};

/**
 *
 * Retrieve and decrypt the email verification session data
 * Returns an object with a payload property containing the decrypted session data
 * or null if session doesn't exist or decryption fails
 *
 */
export async function getEmailVerificationSessionPayload(): Promise<{
  payload: SessionPayload | null;
}> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("email-verification-session");

  if (!sessionCookie) {
    return { error: "Failed to get email veriifcation session cookie." };
  }

  const { payload, error } = await decrypt(sessionCookie.value);

  if (!payload || error) {
    return { error };
  }

  return { payload: payload as SessionPayload };
}

type User = {
  userId: string;
  email: string;
  role: string;
};

type Error = {
  error: string;
};

export async function getUserSession(): Promise<{
  user: User | Error;
}> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user-session");
  if (!sessionCookie) {
    return { error: "Failed to get user session cookie." };
  }
  const { payload, error } = await decrypt(sessionCookie.value);

  if (!payload || error) {
    return { error };
  }
  return { user: payload as User };
}
