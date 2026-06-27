import { NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/pricing"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("better-auth.session_token")?.value;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
