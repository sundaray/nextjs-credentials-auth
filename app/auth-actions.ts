"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { isEmailVerified } from "@/lib/email-verification";
import { hashPassword, isPasswordValid } from "@/lib/password";
import { getUserData } from "@/lib/get-user-data";
import {
  createUserSession,
  createEmailVerificationSession,
  updateEmailVerificationSession,
} from "@/lib/session";
import {
  createEmailVerificationToken,
  createEmailVerificationURL,
  sendVerificationEmail,
} from "@/lib/email-verification";
import { SignInEmailPasswordFormSchema } from "@/schema";
import { doesEmailVerificationSessionExist } from "@/lib/does-email-verification-session-exist";

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
      const { passwordValid } = await isPasswordValid(email, password);

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
