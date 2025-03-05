import React from "react";
import Link from "next/link";
import { getUserSession } from "@/lib/auth/session";

import { UserAccountNavClient } from "@/components/user-account-nav-client";

export async function UserAccountNav() {
  const { user } = await getUserSession();

  if (!user) {
    return (
      <Link
        href="/signin"
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-500"
      >
        Sign in
      </Link>
    );
  }
  return <UserAccountNavClient user={user} />;
}
