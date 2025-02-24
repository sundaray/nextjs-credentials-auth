import React from "react";
import Link from "next/link";

import { UserAccountNavClient } from "@/components/user-account-nav-client";

export async function UserAccountNav() {
  const user = null;

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
