import { NextRequest, NextResponse } from "next/server";

import {
  doesPasswordResetSessionExist,
  getPasswordResetSession,
} from "@/lib/auth/session";
import { timingSafeCompare } from "@/lib/auth/utils";

export async function GET(request: NextRequest) {
  try {
    const authErrorUrl = new URL("/reset-password-error", url);

    const sessionExists = await doesPasswordResetSessionExist();
    const payload = await getPasswordResetSession();

    if (!sessionExists) {
      return NextResponse.redirect(authErrorUrl);
    }

    const { email } = payload;

    await updatePassword(email);
    await deletePasswordResetSession();

    return NextResponse.redirect(new URL("/password-updated", url));
  } catch (error) {
    const authErrorUrl = new URL("/password-reset-error", request.nextUrl);
    return NextResponse.redirect(authErrorUrl);
  }
}
