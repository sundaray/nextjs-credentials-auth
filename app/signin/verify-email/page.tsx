import Link from "next/link";

import { Icons } from "@/components/icons";

export default function VerifyEmail() {
  return (
    <div className="mx-auto px-4 text-center">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-secondary-foreground">
        Verify your email
      </h2>
      <p className="mb-4 text-pretty text-sm text-muted-foreground">
        We&apos;ve sent you an email verification link
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
