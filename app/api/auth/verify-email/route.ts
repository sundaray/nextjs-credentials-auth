import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { assignUserRole } from "@/lib/assign-user-role";
import { createUser } from "@/lib/create-user";
import {
  doesEmailVerificationSessionExist,
  getEmailVerificationSessionPayload,
  deleteEmailVerificationSession,
} from "@/lib/session";
import { timingSafeCompare } from "@/lib/timing-safe-compare";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const tokenFromUrl = url.searchParams.get("token");
    const authErrorUrl = new URL("/auth-error", url);

    const { sessionExists } = await doesEmailVerificationSessionExist();
    const { payload } = await getEmailVerificationSessionPayload();

    if (!tokenFromUrl || !sessionExists || !payload) {
      return NextResponse.redirect(authErrorUrl);
    }

    const { email, hashedPassword, token: tokenFromSession } = payload;

    if (!timingSafeCompare(tokenFromUrl, tokenFromSession)) {
      return NextResponse.redirect(authErrorUrl);
    }

    const role = assignUserRole(email);

    const id = uuidv4();
    await createUser(id, email, hashedPassword, role);

    await deleteEmailVerificationSession();

    return NextResponse.redirect(new URL("/email-verified", url));
  } catch (error) {
    const authErrorUrl = new URL("/auth-error", request.nextUrl);
    return NextResponse.redirect(authErrorUrl);
  }
}
