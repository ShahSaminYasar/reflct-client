import { NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/pricing"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  // Our own first-party cookie — not Better Auth's cross-domain cookie
  const token = request.cookies.get("ba_token")?.value;

  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));

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
