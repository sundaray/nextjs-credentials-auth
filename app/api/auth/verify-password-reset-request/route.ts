import { NextRequest, NextResponse } from "next/server";

import {
  doesPasswordResetSessionExist,
  getPasswordResetSession,
  deleteEmailVerificationSession,
} from "@/lib/auth/session";
import { timingSafeCompare } from "@/lib/auth/utils";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const tokenFromUrl = url.searchParams.get("token");
    const authErrorUrl = new URL("/verify-password-reset-request-error", url);

    const sessionExists = await doesPasswordResetSessionExist();
    const payload = await getPasswordResetSession();

    if (!tokenFromUrl || !sessionExists || !payload) {
      return NextResponse.redirect(authErrorUrl);
    }

    const { token: tokenFromSession } = payload;

    if (!timingSafeCompare(tokenFromUrl, tokenFromSession)) {
      return NextResponse.redirect(authErrorUrl);
    }

    return NextResponse.redirect(new URL("/reset-password", url));
  } catch (error) {
    const authErrorUrl = new URL(
      "/verify-password-reset-request-error",
      request.nextUrl,
    );
    return NextResponse.redirect(authErrorUrl);
  }
}
