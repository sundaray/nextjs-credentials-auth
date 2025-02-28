import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { assignUserRole } from "@/lib/assign-user-role";
import { createUser } from "@/lib/create-user";
import { decrypt } from "@/lib/session";
import { JWTPayload } from "jose";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;

    const tokenFromUrl = url.searchParams.get("token");

    const cookieStore = await cookies();
    const emailVerificationSessionData =
      cookieStore.get("email-verification-session")?.value ?? null;

    const authErrorUrl = new URL("/auth-error", url);

    if (tokenFromUrl === null || emailVerificationSessionData === null) {
      return NextResponse.redirect(authErrorUrl);
    }

    // Decrypt our stored values
    const {
      token: tokenFromSession,
      email,
      hashedPassword,
    } = await decrypt(emailVerificationSessionData);

    // Verify the state parameter matches
    if (tokenFromUrl !== tokenFromSession) {
      return NextResponse.redirect(authErrorUrl);
    }

    const id = uuidv4();

    // Assign user a role
    const role = assignUserRole(email);

    // Create a user record in the database
    await createUser(id, email, hashedPassword, role);

    // Delete email verification session
    await deleteEmailVerificationSession();

    return NextResponse.redirect(new URL("/email-verified", url));
  } catch (error) {
    const authErrorUrl = new URL("/auth-error", request.nextUrl);
    return NextResponse.redirect(authErrorUrl);
  }
}
