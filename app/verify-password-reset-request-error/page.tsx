import Link from "next/link";

import { Icons } from "@/components/icons";

export default function VerifyPasswordResetRequestError() {
  return (
    <div className="mx-auto max-w-md px-4 text-center">
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-red-600">
        Password Reset Request Verification Failed
      </h2>
      <p className="mb-4 text-pretty text-sm text-muted-foreground">
        Something went wrong while verifying your email. Please try again or
        request a new verification link.
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
