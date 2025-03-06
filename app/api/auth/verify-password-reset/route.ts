import { NextRequest, NextResponse } from "next/server";

import {
  doesPasswordResetSessionExist,
  getPasswordResetSession,
} from "@/lib/auth/session";
import { timingSafeCompare } from "@/lib/auth/utils";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const tokenFromUrl = url.searchParams.get("token");
    const authErrorUrl = new URL("/verify-password-reset-error", url);

    const sessionExists = await doesPasswordResetSessionExist();
    const sessionData = await getPasswordResetSession();

    if (!tokenFromUrl || !sessionExists || !sessionData) {
      return NextResponse.redirect(authErrorUrl);
    }

    const { token: tokenFromSession } = sessionData;

    if (!timingSafeCompare(tokenFromUrl, tokenFromSession)) {
      return NextResponse.redirect(authErrorUrl);
    }

    return NextResponse.redirect(new URL("/reset-password", url));
  } catch (error) {
    const authErrorUrl = new URL(
      "/verify-password-reset-error",
      request.nextUrl,
    );
    return NextResponse.redirect(authErrorUrl);
  }
}
