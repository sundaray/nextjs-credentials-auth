import { supabase } from "@/lib/supabase";

/**
 *
 * Checks if a user's email is verified in the database
 *
 */
export async function isEmailVerified(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("emailVerified")
    .eq("email", email)
    .single();

  if (!data || error) {
    console.error("Failed to check email verification status:", error);
    return { error: "Failed to check email verification status." };
  }

  return { emailVerified: !!data.emailVerified };
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
export function createEmailVerificationURL(token: string) {
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
  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your email address",
    react: EmailVerificationTemplate({ url }),
  });

  console.log("Response from resend: ", response);
}
