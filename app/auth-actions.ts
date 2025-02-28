"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { isEmailVerified } from "@/lib/email-verification";
import { hashPassword, isPasswordValid } from "@/lib/password";
import { getUserData } from "@/lib/get-user-data";
import {
  createUserSession,
  createEmailVerificationSession,
} from "@/lib/session";
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
    // Check if user's email has been verified
    const { emailVerified } = await isEmailVerified(email);

    if (emailVerified) {
      // For verified users, validate their password
      const { passwordValid } = await isPasswordValid(email, password);

      if (passwordValid) {
        // Retrieve additional user data needed for session
        const { userId, role } = await getUserData(email);

        // Create authenticated user session
        await createUserSession(userId, email, role);
      } else {
        // Return error for invalid credentials
        return submission.reply({
          formErrors: ["Incorrect email or password"],
        });
      }
    } else {
      needsEmailVerification = true; // Set flag for unverified email

      // Create verification token
      const token = createEmailVerificationToken();

      // Generate verification URL
      const url = await createEmailVerificationURL(token);

      // Hash the password from the form input
      const hashedPassword = await hashPassword(password);

      // Store verification data in a session cookie
      await createEmailVerificationSession(email, hashedPassword, token);

      // Send verification email to the user
      await sendVerificationEmail(email, url);
    }
  } catch (error) {
    console.log("sign in error: ", error);
    errorOccurred = true;

    // Extract validated email and password
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccurred) {
      if (needsEmailVerification) {
        redirect("/signin/verify-email");
      } else {
        // Redirect the user to the page they were originally trying to visit
        redirect(next);
      }
    }
  }
}
