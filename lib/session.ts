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
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setExpirationTime("1hr")
    .encrypt(secret);
}

/************************************************
 *
 * Decrypt JWT
 *
 ************************************************/

export async function decrypt(jwt: string) {
  try {
    const { payload } = await jwtDecrypt(jwt, secret);
    return payload;
  } catch (error) {
    throw Error("Failed to decrypt JWT");
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
 * Create an email verification session
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
    throw error;
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
    console.error("Error deleting email verification session:", error);
    throw error;
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
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("email-verification-session");

    if (!sessionCookie) {
      return { payload: null };
    }

    const decryptedPayload = await decrypt(sessionCookie.value);

    if (decryptedPayload) {
      return { payload: decryptedPayload as SessionPayload };
    } else {
      return { payload: null };
    }
  } catch (error) {
    console.error(
      "Error retrieving email verification session payload:",
      error,
    );
    return { payload: null };
  }
}

type User = {
  userId: string;
  email: string;
  role: string;
};

export async function getUserSession(): Promise<{
  user: User | null;
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie) {
      throw Error("Failed to retrive user session cookie");
    }
    const decryptedPayload = await decrypt(sessionCookie.value);
    return { user: decryptedPayload as User };
  } catch (error) {
    throw error;
  }
}
