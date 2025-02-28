import "server-only";

import { supabase } from "@/lib/supabase";
import { hash, verify } from "@node-rs/argon2";

/**
 *
 * Hash user password
 *
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

/**
 *
 * Validate user password
 *
 */

export async function isPasswordValid(email: string, password: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("password")
      .eq("email", email)
      .single();

    // Handle any database query errors
    if (error) {
      console.error("Error retrieving password hash:", error);
      throw error;
    }

    // Validate password against stored hash
    const isValid = await verify(data.password, password);
    return { passwordValid: isValid };
  } catch (error) {
    console.error("Error in isPasswordValid() function:", error);
    throw error;
  }
}
