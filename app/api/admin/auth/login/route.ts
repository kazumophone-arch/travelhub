import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  getAdminCookieOptions,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeNextPath(String(formData.get("next") ?? ""));

  if (!isAdminPasswordConfigured()) {
    return redirectToLogin(request, "missing-password", nextPath);
  }

  if (!verifyAdminPassword(password)) {
    return redirectToLogin(request, "invalid-password", nextPath);
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionValue(),
    getAdminCookieOptions()
  );

  return response;
}

function redirectToLogin(request: Request, reason: string, nextPath: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", reason);
  url.searchParams.set("next", nextPath);

  return NextResponse.redirect(url);
}

function getSafeNextPath(value: string) {
  if (
    value.startsWith("/admin") &&
    !value.startsWith("/admin/login") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/admin";
}
