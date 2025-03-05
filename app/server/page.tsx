import { getUserSession } from "@/lib/auth/session";

export default async function Server() {
  const { user } = await getUserSession();

  return (
    <div className="px-4 text-center">
      <h1 className="text-xl font-semibold">
        {user ? "User Authenticated" : "User Not Authenticated"}
      </h1>
      <p className="mt-2 text-sm">
        Email: {user ? user.email : "Not available"}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        This is a Server Component
      </p>
    </div>
  );
}
