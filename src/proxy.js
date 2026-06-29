import { NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/pricing"];

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/jwks`),
);

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));

  if (!isAuthRoute && !isProtectedRoute) return NextResponse.next();

  const token = request.cookies.get("ba_token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWKS, {
        issuer: process.env.NEXT_PUBLIC_APP_URL,
        audience: process.env.NEXT_PUBLIC_APP_URL,
      });
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
