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

  try {
    const emailVerified = await isEmailVerified(email);

    console.log("Server Action Email Verified: ", emailVerified);

    if (emailVerified) {
      const passwordVerified = await verifyPassword(email, password);

      console.log("Server Action Password Verified: ", passwordVerified);
      console.log(typeof passwordVerified);

      if (passwordVerified) {
        const { id, role } = await getUserIdAndRole(email);
        await createUserSession(id, email, role);
      } else {
        errorOccurred = true;
        return submission.reply({
          formErrors: ["Incorrect email or password."],
        });
      }
    } else {
      needsEmailVerification = true;

      const token = createEmailVerificationToken();

      const url = createEmailVerificationURL(token);

      const hashedPassword = await hashPassword(password);

      const sessionExists = await doesEmailVerificationSessionExist();

      if (sessionExists) {
        await updateEmailVerificationSession(email, hashedPassword, token);
      } else {
        await createEmailVerificationSession(email, hashedPassword, token);
      }
      await sendVerificationEmail(email, url);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[signInWithEmailAndPassword] error: `, error.message);
    } else {
      console.error(`[signInWithEmailAndPassword] error: `, error);
    }
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      if (needsEmailVerification) {
        redirect("/verify-email");
      } else {
        redirect(next);
      }
    }
  }
}
