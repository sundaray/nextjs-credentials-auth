import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { checkEmailVerificationStatus } from "@/lib/email-verification";
import { sendVerificationEmail } from "@/lib/email-verification";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
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
    const { emailVerified } = checkEmailVerificationStatus(email);
    if (emailVerified) {
      const { passwordVerified } = verifyPassword(password);
      if (passwordVerified) {
        createSession(email);
      } else {
        return submission.reply({
          formErrors: ["Incorrect email or password."],
        });
      }
    } else {
      sendVerificationEmail();
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
