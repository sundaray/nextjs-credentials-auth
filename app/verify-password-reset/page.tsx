import Link from "next/link";

import { Icons } from "@/components/icons";

export default function VerifyPasswordReset() {
  return (
    <div className="mx-auto max-w-md px-4 text-center">
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-secondary-foreground">
        Password reset request received
      </h2>
      <p className="mb-4 text-pretty text-sm text-muted-foreground">
        If an account exists with the email address you provided, we&apos;ll
        send a password reset link. Please check your email inbox, including
        your spam folder.
      </p>
      <Link
        href="/signin"
        className="inline-flex items-center gap-1 p-2 text-sm font-semibold text-primary transition-colors hover:text-blue-500"
      >
        Back to sign in
        <Icons.arrowRight className="size-4" />
      </Link>
    </div>
  );
}
