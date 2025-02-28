"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { isEmailVerified } from "@/lib/email-verification";
import { isPasswordValid } from "@/lib/password";
import { getUserData } from "@/lib/get-user-data";
import { createUserSession } from "@/lib/session";
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
  const submission = parseWithZod(formData, {
    schema: SignInEmailPasswordFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const email = submission.value.email;
  const password = submission.value.password;

  let errorOccurred = false;

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
      const token = createEmailVerificationToken();
      const url = createEmailVerificationURL(token);
      await sendVerificationEmail(url);
      const hashedPassword = await hashPassword();
      await createEmailVerificationSession(email, hashedPassword, token);
    }
  } catch (error) {
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      redirect(next);
    }
  }
}
