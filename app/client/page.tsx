"use client";

import { Icons } from "@/components/icons";
import { useSession } from "@/hooks/use-session";

export default function Client() {
  const { user, loading, error } = useSession();

  if (loading) {
    return (
      <div className="mx-auto flex w-fit items-center gap-2 px-4 text-center text-muted-foreground">
        <Icons.loader className="inline-block size-3.5 animate-spin" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 text-center">
        <h1 className="text-xl font-semibold text-red-600">
          Error fetching user session
        </h1>
        <p className="mt-4 text-muted-foreground">
          This is a Client Component.
        </p>
      </div>
    );
  }
  return (
    <div className="px-4 text-center">
      <h1 className="text-xl font-semibold">
        {user ? "User Authenticated" : "User Not Authenticated"}
      </h1>
      <p className="mt-2 text-sm">
        Email: {user ? user.email : "Not available"}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        This is a Client Component
      </p>
    </div>
  );
}
