/************************************************
 *
 * Create password reset verification token
 *
 ************************************************/
import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

export function createPasswordResetToken(): string {
  const randomValues = new Uint8Array(32);
  getRandomValues(randomValues);
  return base64url.encode(randomValues);
}

/************************************************
 *
 * Create password reset verification URL
 *
 ************************************************/
export function createPasswordResetURL(token: string): string {
  const url = new URL("/api/auth/verify-password-reset", process.env.BASE_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

/************************************************
 *
 * Send password reset verification email
 *
 ************************************************/
import { resend } from "@/lib/resend";
import { PasswordResetTemplate } from "@/components/password-reset-template";

export async function sendPasswordResetEmail(email: string, url: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your email address",
      react: PasswordResetTemplate({ url }),
    });

    if (error) {
      console.error(`[sendPasswordResetEmail] error: `, error);
      throw new Error("Failed to send password reset verification email.");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}
