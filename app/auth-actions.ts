"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getUserIdAndRole } from "@/lib/auth/user";
import {
  createUserSession,
  createEmailVerificationSession,
  updateEmailVerificationSession,
  doesEmailVerificationSessionExist,
} from "@/lib/auth/session";
import {
  isEmailVerified,
  createEmailVerificationToken,
  createEmailVerificationURL,
  sendVerificationEmail,
} from "@/lib/auth/email-verification";
import { SignInEmailPasswordFormSchema } from "@/schema";

/************************************************
 * Sign In With Email and Password
 ************************************************/

export async function signInWithEmailAndPassword(
  next: string,
  prevState: unknown,
  formData: FormData,
) {
  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: SignInEmailPasswordFormSchema,
  });

  // Return validation errors if any
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Extract validated email and password
  const email = submission.value.email;
  const password = submission.value.password;

  let errorOccurred = false;
  let needsEmailVerification = false;

  const isEmailVerifiedResult = await isEmailVerified(email);

  if ("error" in isEmailVerifiedResult) {
    const result = createEmailVerificationToken();

    const result = await createEmailVerificationURL(token);

    const result = await hashPassword(password);

    const result = await doesEmailVerificationSessionExist();

    if (sessionExists) {
      await updateEmailVerificationSession(email, hashedPassword, token);
    } else {
      await createEmailVerificationSession(email, hashedPassword, token);
    }
    await sendVerificationEmail(email, url);
  // Verify password
  const verifyPasswordResult = await verifyPassword(email, password);

  if ("error" in verifyPasswordResult) {
    return submission.reply({
      formErrors: ["Incorrect email or password."],
    });
  }

  // Get user id and role
  const result = await getUserIdAndRole(email);

  if ("error" in result) {
    return submission.reply({
      formErrors: [`${result.error} Please try again.`],
    });
  }

  const result = await createUserSession(
    result.userId,
    result.email,
    result.role,
  );
}
