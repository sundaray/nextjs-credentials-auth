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

export async function createUser(
  email: string,
  hashedPassword: string,
  role: string,
): Promise<User> {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        role,
      })
      .select("id, email, role")
      .single();

    if (!data || error) {
      console.error(`[createUser] error: `, error);
      throw new Error("Failed to create user.");
    }
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}

/************************************************
 *
 * Get user password
 *
 ************************************************/

export async function getUserPassword(email: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("password")
      .eq("email", email)
      .single();

    if (!data || error) {
      console.error(`[getUserPassword] error: `, error);
      throw new Error("Failed to get user password.");
    }

    return data.password;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}

/************************************************
 *
 * Get user id and role
 *
 ************************************************/

export async function getUserIdAndRole(
  email: string,
): Promise<{ id: string; role: string }> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, role")
      .eq("email", email)
      .single();

    if (!data || error) {
      console.error(`[getUserIdAndRole] error: `, error);
      throw new Error("Failed to get user id and role.");
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Unknown error: ${error}`;
    throw new Error(message);
  }
}

/************************************************
 *
 * Assign user role
 *
 ************************************************/

type UserRole = "admin" | "user";

const ADMIN_EMAILS = ["rawgrittt@gmail.com"];

export function assignUserRole(email: string): UserRole {
  const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";
  return role;
}
