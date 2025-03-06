"use server";

import { headers } from "next/headers";
import { authRateLimit } from "@/lib/rate-limit";
import chalk from "chalk";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getUserIdAndRole } from "@/lib/auth/user";
import {
  createUserSession,
  deleteUserSession,
  createEmailVerificationSession,
  createPasswordResetSession,
  updateEmailVerificationSession,
  updatePasswordResetSession,
  doesEmailVerificationSessionExist,
  doesPasswordResetSessionExist,
  getPasswordResetSession,
  deletePasswordResetSession,
} from "@/lib/auth/session";
import { updatePassword } from "@/lib/auth/user";
import { ResetPasswordFormSchema } from "@/schema";

import {
  isEmailVerified,
  createEmailVerificationToken,
  createEmailVerificationURL,
  sendVerificationEmail,
} from "@/lib/auth/email-verification";
import {
  createPasswordResetToken,
  createPasswordResetURL,
  sendPasswordResetEmail,
} from "@/lib/auth/password-reset";
import { SignInEmailPasswordFormSchema } from "@/schema";

/************************************************
 *
 * Sign In With Email and Password
 *
 ************************************************/

export async function signInWithEmailAndPassword(
  next: string,
  prevState: unknown,
  formData: FormData,
) {
  const headersList = await headers();
  const clientIP = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";

  // check rate limit
  const rateLimitResult = await authRateLimit(clientIP);

  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: SignInEmailPasswordFormSchema,
  });

  // Return validation errors if any
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Return rate limit error if any
  if (rateLimitResult.limited) {
    return submission.reply({
      formErrors: [rateLimitResult.message],
    });
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

/************************************************
 *
 * Forgot user password
 *
 ************************************************/

import { ForgotPasswordFormSchema } from "@/schema";

export async function forgotPassword(prevState: unknown, formData: FormData) {
  const headersList = await headers();
  const clientIP = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";

  // check rate limit
  const rateLimitResult = await authRateLimit(clientIP);

  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: ForgotPasswordFormSchema,
  });

  // Return validation errors if any
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Return rate limit error if any
  if (rateLimitResult.limited) {
    return submission.reply({
      formErrors: [rateLimitResult.message],
    });
  }

  const email = submission.value.email;

  let errorOccurred = false;

  try {
    const token = createPasswordResetToken();

    const url = createPasswordResetURL(token);

    const sessionExists = await doesPasswordResetSessionExist();

    if (sessionExists) {
      await updatePasswordResetSession(email, token);
    } else {
      await createPasswordResetSession(email, token);
    }
    await sendPasswordResetEmail(email, url);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("[resetPassword] error: "), error.message);
    } else {
      console.error(chalk.red("[resetPassword] error: "), error);
    }
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      // Redirect to success page if no errors occurred
      redirect("/verify-password-reset");
    }
  }
}
/************************************************
 *
 * Reset user password
 *
 ************************************************/

export async function resetPassword(prevState: unknown, formData: FormData) {
  const headersList = await headers();
  const clientIP = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";

  // check rate limit
  const rateLimitResult = await authRateLimit(clientIP);

  // Parse and validate form data using zod schema
  const submission = parseWithZod(formData, {
    schema: ResetPasswordFormSchema,
  });

  // Return validation errors if any
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Return rate limit error if any
  if (rateLimitResult.limited) {
    return submission.reply({
      formErrors: [rateLimitResult.message],
    });
  }

  // Extract validated password
  const newPassword = submission.value.newPassword;

  let errorOccurred = false;

  try {
    // Verify that there's an active password reset session
    const sessionExists = await doesPasswordResetSessionExist();
    if (!sessionExists) {
      errorOccurred = true;
      return submission.reply({
        formErrors: [
          "Your password reset session has expired. Please request a new password reset link.",
        ],
      });
    }

    // Get email from the password reset session
    const { email } = await getPasswordResetSession();

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password in the database
    await updatePassword(email, hashedPassword);

    // Delete the password reset session
    await deletePasswordResetSession();
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("[resetPassword] error: "), error.message);
    } else {
      console.error(chalk.red("[resetPassword] error: "), error);
    }
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      // Redirect to success page if no errors occurred
      redirect("/password-reset");
    }
  }
}

/************************************************
 *
 * Sign out
 *
 ************************************************/

export async function signOut() {
  await deleteUserSession();
  redirect("/");
}
