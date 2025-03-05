import { NextRequest, NextResponse } from "next/server";

import { assignUserRole, createUser } from "@/lib/auth/user";
import {
  doesEmailVerificationSessionExist,
  getEmailVerificationSessionPayload,
  deleteEmailVerificationSession,
} from "@/lib/auth/session";
import { timingSafeCompare } from "@/lib/auth/utils";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const tokenFromUrl = url.searchParams.get("token");
    const authErrorUrl = new URL("/auth-error", url);

    const sessionExists = await doesEmailVerificationSessionExist();
    const payload = await getEmailVerificationSessionPayload();

    if (!tokenFromUrl || !sessionExists || !payload) {
      return NextResponse.redirect(authErrorUrl);
    }

    const { email, hashedPassword, token: tokenFromSession } = payload;

    if (!timingSafeCompare(tokenFromUrl, tokenFromSession)) {
      return NextResponse.redirect(authErrorUrl);
    }

    const role = assignUserRole(email);

    await createUser(email, hashedPassword, role);

    await deleteEmailVerificationSession();

    return NextResponse.redirect(new URL("/email-verified", url));
  } catch (error) {
    const authErrorUrl = new URL("/auth-error", request.nextUrl);
    return NextResponse.redirect(authErrorUrl);
  }
}
