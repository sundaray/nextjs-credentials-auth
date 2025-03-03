import "server-only";

import { cookies } from "next/headers";

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
