import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminCookieOptions,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    new URL("/admin/login?logout=1", request.url)
  );

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });

  return response;
}
