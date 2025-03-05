import "server-only";

import { cookies } from "next/headers";
import { base64url, EncryptJWT, jwtDecrypt } from "jose";
import type { JWTPayload } from "jose";

const key = process.env.JWT_ENCRYPTION_KEY ?? "";
const secret = base64url.decode(key);

/************************************************
 *
 * Encrypt payload
 *
 ************************************************/

export async function encrypt(payload: any): Promise<string> {
  try {
    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
      .setExpirationTime("1hr")
      .encrypt(secret);
  } catch (error) {
    throw new Error("Failed to encrypt payload.");
  }
}

/************************************************
 *
 * Decrypt JWT
 *
 ************************************************/

export async function decrypt<T extends JWTPayload>(jwt: string): Promise<T> {
  try {
    const { payload } = await jwtDecrypt(jwt, secret);
    return payload as T;
  } catch (error) {
    throw new Error("Failed to decrypt JWT.");
  }
}

/************************************************
 *
 * Create user session
 *
 ************************************************/

export async function createUserSession(
  id: string,
  email: string,
  role: string,
) {
  try {
    const sessionData = await encrypt({
      id,
      email,
      role,
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "user-session",
      value: sessionData,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: "lax",
      path: "/",
    });

    console.log("User session created");
  } catch (error) {
    throw new Error("Failed to create user session.");
  }
}

/************************************************
 *
 * Create email verification session
 *
 ************************************************/
export async function createEmailVerificationSession(
  email: string,
  hashedPassword: string,
  token: string,
) {
  try {
    const sessionData = await encrypt({
      email,
      hashedPassword,
      token,
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "email-verification-session",
      value: sessionData,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    throw new Error("Failed to create email verification session.");
  }
}

/************************************************
 *
 * Update email verification session
 *
 ************************************************/
export async function updateEmailVerificationSession(
  email: string,
  hashedPassword: string,
  token: string,
) {
  try {
    const sessionData = await encrypt({
      email,
      hashedPassword,
      token,
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "email-verification-session",
      value: sessionData,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    throw Error("Failed to update email verification session.");
  }
}

/************************************************
 *
 * Check if an email verification session exists
 *
 ************************************************/

export async function doesEmailVerificationSessionExist(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("email-verification-session");

    return !!sessionCookie;
  } catch (error) {
    throw Error("Failed to check email verification session");
  }
}

/************************************************
 *
 * Delete the email verification session
 *
 ************************************************/

export async function deleteEmailVerificationSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("email-verification-session");
  } catch (error) {
    throw Error("Failed to delete email verification session.");
  }
}

/************************************************
 *
 * Get the email verification session payload
 *
 ************************************************/
type EmailVerificationSession = {
  token: string;
  email: string;
  hashedPassword: string;
};

export async function getEmailVerificationSession(): Promise<EmailVerificationSession> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("email-verification-session");

    if (!sessionCookie) {
      throw new Error("Failed to get email verification session");
    }

    return await decrypt<EmailVerificationSession>(sessionCookie.value);
  } catch (error) {
    throw Error("Failed to get email verification session payload");
  }
}

/************************************************
 *
 * Get user session
 *
 ************************************************/

type User = {
  id: string;
  email: string;
  role: string;
};

export async function getUserSession(): Promise<{ user: User | null }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user-session");

    if (!sessionCookie) {
      return { user: null };
    }

    const user = await decrypt<User>(sessionCookie.value);
    return { user };
  } catch (error) {
    throw new Error("Failed to decrypt user session");
  }
}

/************************************************
 *
 * Delete user session
 *
 ************************************************/

export async function deleteUserSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("user-session");
  } catch (error) {
    throw Error("Failed to delete email verification session.");
  }
}
