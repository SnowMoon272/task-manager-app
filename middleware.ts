import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const protectedRoutes = ["/dashboard", "/tasks", "/profile", "/board", "/settings"];
// const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  // TEMPORALMENTE DESHABILITADO PARA DEBUG
  console.log("Middleware called for:", request.nextUrl.pathname);
  return NextResponse.next();

  // const { pathname } = request.nextUrl;
  // const token = request.cookies.get("auth-token")?.value;
  // const isAuthenticated = !!token;

  // if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // if (pathname === "/" && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

