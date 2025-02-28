export type UserRole = "admin" | "user";

const ADMIN_EMAILS = ["rawgrittt@gmail.com"];

export function assignUserRole(email: string): UserRole {
  return ADMIN_EMAILS.includes(email) ? "admin" : "user";
}
