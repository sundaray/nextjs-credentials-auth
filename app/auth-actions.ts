"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { verifyEmail } from "@/lib/auth/email-verification";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getUserData } from "@/lib/auth/user";
import {
  createUserSession,
  createEmailVerificationSession,
  updateEmailVerificationSession,
  doesEmailVerificationSessionExist,
} from "@/lib/auth/session";
import {
  createEmailVerificationToken,
  createEmailVerificationURL,
  sendVerificationEmail,
} from "@/lib/email-verification";
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
    const { emailVerified } = await isEmailVerified(email);

    if (emailVerified) {
      const { passwordVerified } = await verifyPassword(email, password);

      if (passwordValid) {
        const { userId, role } = await getUserData(email);

        await createUserSession(userId, email, role);
      } else {
        return submission.reply({
          formErrors: ["Incorrect email or password"],
        });
      }
    } else {
      needsEmailVerification = true;

      const token = createEmailVerificationToken();

      const url = await createEmailVerificationURL(token);

      const hashedPassword = await hashPassword(password);

      const { sessionExists } = await doesEmailVerificationSessionExist();

      if (sessionExists) {
        await updateEmailVerificationSession(email, hashedPassword, token);
      } else {
        await createEmailVerificationSession(email, hashedPassword, token);
      }
      await sendVerificationEmail(email, url);
    }
  } catch (error) {
    console.log("sign in error: ", error);
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      if (needsEmailVerification) {
        redirect("/signin/verify-email");
      } else {
        redirect(next);
      }
    }
  }
}
