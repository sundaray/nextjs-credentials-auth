import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/session";

export async function GET() {
  try {
    const { user } = await getUserSession();

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Failed to get user session: ", error.message);
    }
    throw error;
  }
}
