import Link from "next/link";

import { Icons } from "@/components/icons";

export default function EmailVerified() {
  return (
    <div className="mx-auto max-w-md px-4 text-center">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-secondary-foreground">
        Email verified
      </h2>
      <p className="mb-4 text-pretty text-sm text-muted-foreground">
        Your email has been successfully verified. You can now sign in to access
        your account.
      </p>
      <Link
        href="/signin"
        className="inline-flex items-center gap-1 p-2 text-sm font-semibold text-primary transition-colors hover:text-blue-500"
      >
        Sign in
        <Icons.arrowRight className="size-4" />
      </Link>
    </div>
  );
}
