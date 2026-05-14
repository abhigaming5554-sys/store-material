import { NextResponse }
from "next/server";

import type { NextRequest }
from "next/server";

export function middleware(
  req: NextRequest
) {

  const token =
    req.cookies.get(
      "token"
    )?.value;

  const pathname =
    req.nextUrl.pathname;

  // Protected Routes
  const protectedRoutes = [

    "/cart",

    "/orders",

    "/wishlist",

    "/profile",

    "/admin",

  ];

  const isProtected =
    protectedRoutes.some(
      (route) =>
        pathname.startsWith(
          route
        )
    );

  // If not logged in
  if (
    isProtected &&
    !token
  ) {

    return NextResponse.redirect(

      new URL(
        "/login",
        req.url
      )

    );

  }

  return NextResponse.next();

}

export const config = {

  matcher: [

    "/cart/:path*",

    "/orders/:path*",

    "/wishlist/:path*",

    "/profile/:path*",

    "/admin/:path*",

  ],

};