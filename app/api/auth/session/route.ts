import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const { user } = await getUserSession();

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get user session." },
      { status: 500 },
    );
  }
}
