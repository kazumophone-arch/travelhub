import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isAdminPasswordConfigured,
  verifyAdminSession,
} from "@/lib/admin-auth";

const ADMIN_LOGIN_PATH = "/admin/login";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAuthApi = pathname.startsWith("/api/admin/auth/");
  const isLoginPage = pathname === ADMIN_LOGIN_PATH;

  if (isAuthApi) {
    return NextResponse.next();
  }

  const isAuthorized = verifyAdminSession(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  );

  if (isLoginPage) {
    if (isAuthorized && isAdminPasswordConfigured()) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (!isAdminPasswordConfigured()) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "管理パスワードが設定されていません。" },
        { status: 503 }
      );
    }

    return redirectToLogin(request);
  }

  if (!isAuthorized) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "管理画面にログインしてください。" },
        { status: 401 }
      );
    }

    return redirectToLogin(request, `${pathname}${search}`);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, nextPath = "/admin") {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
