import { getCookie } from "cookies-next";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const accessToken = getCookie("token", { req: request });

  const { pathname } = request.nextUrl;

  if (
    accessToken &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    !accessToken &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/chats"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return undefined;
}
