import "server-only";

import { supabase } from "@/lib/supabase";

/************************************************
 *
 * Create user
 *
 ************************************************/

type User = {
  id: string;
  email: string;
  role: string;
};

type CreateUserResult = { user: User } | { error: string };

export async function createUser(
  email: string,
  hashedPassword: string,
  role: string,
): Promise<CreateUserResult> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      email,
      hashedPassword,
      role,
    })
    .select("id, email, role")
    .single();

  if (error) {
    console.error("Failed to create user: ", error);
    return { error: "Failed to create user." };
  }

  return { user: data };
}

/************************************************
 *
 * Get user password
 *
 ************************************************/

type GetUserPasswordResult = { hashedPassword: string } | { error: string };

export async function getUserPassword(
  email: string,
): Promise<GetUserPasswordResult> {
  const { data, error } = await supabase
    .from("users")
    .select("password")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Failed to get user password: ", error);
    return { error: "Failed to get user password." };
  }

  return { hashedPassword: data.password };
}

/************************************************
 *
 * Get user id and role
 *
 ************************************************/

type GetUserIdAndRoleResult = { id: string; role: string } | { error: string };

export async function getUserIdAndRole(
  email: string,
): Promise<GetUserIdAndRoleResult> {
  const { data, error } = await supabase
    .from("users")
    .select("id, role")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Failed to get user id and role: ", error);
    return { error: "Failed to get user id and role." };
  }

  return {
    id: data.id,
    role: data.role,
  };
}

/************************************************
 *
 * Assign user role
 *
 ************************************************/

export type UserRole = "admin" | "user";

const ADMIN_EMAILS = ["rawgrittt@gmail.com"];

export function assignUserRole(email: string): UserRole {
  const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";
  return role;
}
