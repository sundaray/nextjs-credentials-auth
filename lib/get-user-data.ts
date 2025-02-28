import "server-only";

import { supabase } from "@/lib/supabase";

/**
 *
 * Retrieves user data needed for session creation
 *
 */
export async function getUserData(email: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, role")
      .eq("email", email)
      .single();

    // Handle any database query errors
    if (error) {
      console.error("Error retrieving user data:", error);
      throw error;
    }

    // Return just the userId and role
    return {
      userId: data.id,
      role: data.role,
    };
  } catch (error) {
    console.error("Error in getUserData() function:", error);
    throw error;
  }
}
