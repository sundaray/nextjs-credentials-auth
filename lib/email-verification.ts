import { supabase } from "@/lib/supabase";

/**
 *
 * Checks if a user's email is verified in the database
 *
 */
export async function isEmailVerified(email: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("emailVerified")
      .eq("email", email)
      .single();

    // Handle any database query errors
    if (error) {
      console.error("Error checking email verification status:", error);
      throw error;
    }

    // If no user is found with this email
    if (!data) {
      return { emailVerified: false };
    }

    // Return the verification status
    return { emailVerified: !!data.emailVerified };
  } catch (error) {
    console.error("Error in checkEmailVerificationStatus function:", error);
    // Rethrow the error so the server action can handle it with a generic message
    throw error;
  }
}

/**
 *
 * Sends a verification email to the user
 *
 */
export async function sendVerificationEmail() {}
