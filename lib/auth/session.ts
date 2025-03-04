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
type EncryptResult = { encryptedJWT: string } | { error: string };

export async function encrypt(payload: any): Promise<EncryptResult> {
  try {
    const encryptedJWT = await new EncryptJWT(payload)
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
      .setExpirationTime("1hr")
      .encrypt(secret);
    return { encryptedJWT };
  } catch (error) {
    return { error: "Failed to encrypt JWT." };
  }
}

/************************************************
 *
 * Decrypt JWT
 *
 ************************************************/
type DecryptResult<T extends JWTPayload = JWTPayload> =
  | { payload: T }
  | { error: string };

export async function decrypt<T extends JWTPayload>(
  jwt: string,
): Promise<DecryptResult<T>> {
  try {
    const { payload } = await jwtDecrypt(jwt, secret);
    return { payload: payload as T };
  } catch (error) {
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
  const result = await encrypt({
    userId,
    email,
    role,
  });

  if ("error" in result) {
    return { error: result.error };
  }

  const sessionData = result.encryptedJWT;

  try {
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
  } catch (error) {
    return { error: "Failed to create user session." };
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
  const result = await encrypt({
    email,
    hashedPassword,
    token,
  });

  if ("error" in result) {
    return { error: result.error };
  }

  const sessionData = result.encryptedJWT;

  try {
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
    return { error: "Failed to create email verification session." };
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
  const result = await encrypt({
    email,
    hashedPassword,
    token,
  });

  if ("error" in result) {
    return { error: result.error };
  }

  const sessionData = result.encryptedJWT;
  try {
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
    return { error: "Failed to update email verification session." };
  }
}

/************************************************
 *
 * Check if an email verification session exists
 *
 ************************************************/

type DoesEmailVerificationSessionExistResult =
  | { sessionExists: boolean }
  | { error: string };

export async function doesEmailVerificationSessionExist(): Promise<DoesEmailVerificationSessionExistResult> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("email-verification-session");

    return { sessionExists: !!sessionCookie };
  } catch (error) {
    return { error: "Failed to retrive email verification session cookie" };
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
    return { error: "Failed to delete email verification session." };
  }
}

/************************************************
 *
 * Get the email verification session payload
 *
 ************************************************/
type EmailVerificationSessionPayload = {
  token: string;
  email: string;
  hashedPassword: string;
};

type GetEmailVerificationSessionPayloadResult =
  | { payload: EmailVerificationSessionPayload }
  | { error: string };

export async function getEmailVerificationSessionPayload(): Promise<GetEmailVerificationSessionPayloadResult> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("email-verification-session");

  if (!sessionCookie) {
    return { error: "Failed to get email veriifcation session." };
  }

  const result = await decrypt<EmailVerificationSessionPayload>(
    sessionCookie.value,
  );

  if ("error" in result) {
    return { error: result.error };
  }

  const { payload } = result;
  return { payload };
}

/************************************************
 *
 * Get user session
 *
 ************************************************/

type User = {
  userId: string;
  email: string;
  role: string;
};

type GetUserSessionResult = { user: User } | { error: string };

export async function getUserSession(): Promise<GetUserSessionResult> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user-session");

  if (!sessionCookie) {
    return { error: "Failed to get user session." };
  }
  const result = await decrypt<User>(sessionCookie.value);

  if ("error" in result) {
    return { error: result.error };
  }

  const { payload } = result;

  return { user: payload };
}
