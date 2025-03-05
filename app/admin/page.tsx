import { getUserSession } from "@/lib/auth/session";

export default async function Admin() {
  const { user } = await getUserSession();

  if (user?.role !== "admin") {
    return (
      <div className="px-4 text-center">
        <h1 className="text-xl font-semibold text-red-600">Access Denied</h1>
        <p className="mt-4 text-pretty font-medium text-muted-foreground">
          This page is only accessible to authenticated users having
          &quot;admin&quot; status.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 text-center">
      <h1 className="text-xl font-semibold text-secondary-foreground">
        Welcome Admin
      </h1>
      <p className="mt-2 text-sm">Email: {user?.email}</p>
    </div>
  );
}
