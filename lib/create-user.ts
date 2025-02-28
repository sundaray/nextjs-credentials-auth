import { supabase } from "@/lib/supabase";

export async function createUser(
  id: string,
  email: string,
  hashedPassword: string,
  role: string,
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id,
          email,
          hashedPassword,
          role,
        },
        {
          onConflict: "email",
          ignoreDuplicates: true,
        },
      )
      .select()
      .maybeSingle();

    if (error) {
      console.log("Create user error: ", error);
      throw error;
    }

    return { data };
  } catch (error) {
    console.log("Create user error: ", error);
    throw error;
  }
}
