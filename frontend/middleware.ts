import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (
    !token &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/signup"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validate token with NestJS backend
  if (token) {
    try {
      const apiUrl = process.env.API_URL;
      if (!apiUrl) {
        console.error(
          "Middleware error: API_URL environment variable is not defined"
        );
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const response = await fetch(`${apiUrl}/auth/validate`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error(
          `Middleware token validation failed: ${response.statusText}`
        );
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("Middleware token validation error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/protected/:path*"],
};
