// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";

// // export async function middleware(request: NextRequest) {
// //   const token = request.cookies.get("token")?.value;

// //   if (
// //     !token &&
// //     request.nextUrl.pathname !== "/login" &&
// //     request.nextUrl.pathname !== "/signup"
// //   ) {
// //     return NextResponse.redirect(new URL("/login", request.url));
// //   }

// //   // Validate token with NestJS backend
// //   if (token) {
// //     try {
// //       const apiUrl = process.env.API_URL;
// //       if (!apiUrl) {
// //         console.error(
// //           "Middleware error: API_URL environment variable is not defined"
// //         );
// //         return NextResponse.redirect(new URL("/login", request.url));
// //       }

// //       const response = await fetch(`${apiUrl}/auth/validate`, {
// //         method: "GET",
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (!response.ok) {
// //         console.error(
// //           `Middleware token validation failed: ${response.statusText}`
// //         );
// //         return NextResponse.redirect(new URL("/login", request.url));
// //       }
// //     } catch (error) {
// //       console.error("Middleware token validation error:", error);
// //       return NextResponse.redirect(new URL("/login", request.url));
// //     }
// //   }

// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: ["/", "/protected/:path*"],
// // };

// import { NextResponse, NextRequest } from "next/server";
// import axios from "axios";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Log the pathname for debugging
//   console.log(`Middleware: Processing request for ${pathname}`);

//   // Define public routes that don't require authentication
//   const publicRoutes = [
//     "/login",
//     "/signup",
//     "/verify-email",
//     "/api/login",
//     "/api/signup",
//     "/api/verify-email",
//   ];

//   // Allow public routes, static assets, and API routes
//   if (
//     publicRoutes.includes(pathname) ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api/") ||
//     pathname === "/favicon.ico"
//   ) {
//     console.log(`Middleware: Allowing public route ${pathname}`);
//     return NextResponse.next();
//   }

//   // Get the JWT token from the cookie
//   const token = request.cookies.get("token")?.value;

//   if (!token) {
//     console.log(
//       `Middleware: No token found, redirecting to /login from ${pathname}`
//     );
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Validate the token with the NestJS backend
//   try {
//     const apiUrl = process.env.API_URL;
//     if (!apiUrl) {
//       console.error(
//         "Middleware error: API_URL environment variable is not defined"
//       );
//       const loginUrl = new URL("/login", request.url);
//       loginUrl.searchParams.set("redirect", pathname);
//       return NextResponse.redirect(loginUrl);
//     }

//     console.log(`Middleware: Validating token for ${pathname}`);
//     const response = await axios.get(`${apiUrl}/auth/validate`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (response.status === 200) {
//       console.log(`Middleware: Token valid for ${pathname}`);
//       return NextResponse.next();
//     } else {
//       console.log(
//         `Middleware: Invalid response status ${response.status}, redirecting to /login`
//       );
//       const loginUrl = new URL("/login", request.url);
//       loginUrl.searchParams.set("redirect", pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   } catch (error: any) {
//     console.error(
//       `Middleware: Token validation error for ${pathname}:`,
//       error.response?.data || error.message
//     );
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }
// }

// export const config = {
//   matcher: ["/", "/((?!_next|api/|favicon.ico|login|signup|verify-email).*)"],
// };
