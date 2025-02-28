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
    console.error("Error in isEmailVerified() function:", error);
    // Rethrow the error so the server action can handle it with a generic message
    throw error;
  }
}

/**
 *
 * Create email verification token
 *
 */
import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

export function createEmailVerificationToken(): string {
  const randomValues = new Uint8Array(32);
  getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

/**
 *
 * Create email verification URL
 *
 */
export async function createEmailVerificationURL(token: string) {
  const url = new URL("/api/auth/verify-email", process.env.BASE_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

/**
 *
 * Sends a verification email
 *
 */
import { resend } from "@/lib/resend";
import { EmailVerificationTemplate } from "@/components/email-verification-template";

export async function sendVerificationEmail(email: string, url: string) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your email address",
      react: EmailVerificationTemplate({ url }),
    });

    if (error) {
      console.error("Failed to send verification email:", error);
      throw error;
    }
  } catch (error) {
    console.error(
      "An unexpected error occurred while sending verification email:",
      error,
    );
    throw error;
  }
}
