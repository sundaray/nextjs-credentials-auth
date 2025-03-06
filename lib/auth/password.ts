import "server-only";

import chalk from "chalk";
import { hash, verify } from "@node-rs/argon2";
import { getUserPassword } from "@/lib/auth/user";

/************************************************
 *
 * Hash password
 *
 ************************************************/
export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password);
  } catch (error) {
    console.error(chalk.red("[hashPassword] error: "), error);
    throw new Error("Failed to hash password.");
  }
}

/************************************************
 *
 * Verify password
 *
 ************************************************/

export async function verifyPassword(
  email: string,
  password: string,
): Promise<boolean> {
  try {
    const hashedPassword = await getUserPassword(email);
    return await verify(hashedPassword, password);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}
