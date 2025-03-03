import "server-only";

import { hash, verify } from "@node-rs/argon2";
import { getUserPassword } from "@/lib/auth/user";

/************************************************
 *
 * Hash password
 *
 ************************************************/
type HashPasswordResult = { hashedPassword: string } | { error: string };

export async function hashPassword(
  password: string,
): Promise<HashPasswordResult> {
  try {
    const hashedPassword = await hash(password);
    return { hashedPassword };
  } catch (error) {
    console.error("Failed to hash password:", error);
    return { error: "Failed to hash password." };
  }
}

/************************************************
 *
 * Verify password
 *
 ************************************************/

type VerifyPasswordResult = { verified: boolean } | { error: string };

export async function verifyPassword(
  email: string,
  password: string,
): Promise<VerifyPasswordResult> {
  const response = await getUserPassword(email);

  if ("error" in response) {
    return { error: response.error };
  }

  try {
    const verified = await verify(response.hashedPassword, password);
    return { verified };
  } catch (error) {
    console.error("Failed to verify password:", error);
    return { error: "Failed to verify password." };
  }
}
