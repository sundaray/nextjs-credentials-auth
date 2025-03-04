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
    return { error: "Failed to hash password." };
  }
}

/************************************************
 *
 * Verify password
 *
 ************************************************/

type VerifyPasswordResult = { passwordVerified: boolean } | { error: string };

export async function verifyPassword(
  email: string,
  password: string,
): Promise<VerifyPasswordResult> {
  const result = await getUserPassword(email);

  if ("error" in result) {
    return { error: result.error };
  }

  try {
    const passwordVerified = await verify(result.hashedPassword, password);
    return { passwordVerified };
  } catch (error) {
    return { error: "Failed to verify password." };
  }
}
