import "server-only";
import { supabase } from "@/lib/supabase";

import chalk from "chalk";
import { hash, verify } from "@node-rs/argon2";
// import { getUserPassword } from "@/lib/auth/user";

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
    const { data, error } = await supabase
      .from("users")
      .select("password")
      .eq("email", email)
      .single();

    if (error) {
      console.error(chalk.red("[verifyPassword] error: "), error);
      throw new Error("Failed to verify password.");
    }

    const hashedPassword = data.password;
    return await verify(hashedPassword, password);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}
