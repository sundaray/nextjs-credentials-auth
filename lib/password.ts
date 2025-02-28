import "server-only";

import { supabase } from "@/lib/supabase";
import { verify } from "@node-rs/argon2";

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
