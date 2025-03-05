import { supabase } from "@/lib/supabase";

/************************************************
 *
 * Check if a user's email is verified
 *
 ************************************************/

export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("emailVerified")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error(`[isEmailVerified] error: `, error);
      throw new Error("Failed to verify email.");
    }

    // If data is null (no user found), return false
    // Otherwise, return the value of emailVerified
    return data ? !!data.emailVerified : false;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}

/************************************************
 *
 * Check email verification token
 *
 ************************************************/
import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

export function createEmailVerificationToken(): string {
  const randomValues = new Uint8Array(32);
  getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

/************************************************
 *
 * Check email verification URL
 *
 ************************************************/
export function createEmailVerificationURL(token: string): string {
  const url = new URL("/api/auth/verify-email", process.env.BASE_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

/************************************************
 *
 * Send verification email
 *
 ************************************************/
import { resend } from "@/lib/resend";
import { EmailVerificationTemplate } from "@/components/email-verification-template";

export async function sendVerificationEmail(email: string, url: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your email address",
      react: EmailVerificationTemplate({ url }),
    });

    if (error) {
      console.error(`[sendVerificationEmail] error: `, error);
      throw new Error("Failed to send verification email.");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}
