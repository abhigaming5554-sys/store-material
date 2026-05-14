import { NextResponse }
from "next/server";

import type {
  NextRequest,
} from "next/server";

import jwt
from "jsonwebtoken";

export function middleware(
  req: NextRequest
) {

  try {

    const path =
      req.nextUrl.pathname;

    // Protect Admin Routes
    if (
      path.startsWith(
        "/admin"
      )
    ) {

      const token =
        req.cookies.get(
          "token"
        )?.value;

      if (!token) {

        return NextResponse.redirect(

          new URL(
            "/login",
            req.url
          )

        );

      }

      const decoded: any =
        jwt.verify(

          token,

          process.env
            .JWT_SECRET ||
            "secret"

        );

      // Admin Email Check
      if (

        decoded.email !==
        "abhigaming5554@gmail.com"

      ) {

        return NextResponse.redirect(

          new URL(
            "/",
            req.url
          )

        );

      }

    }

    return NextResponse.next();

  } catch (error) {

    return NextResponse.redirect(

      new URL(
        "/login",
        req.url
      )

    );

  }

}

// Routes
export const config = {

  matcher: [

    "/admin/:path*",

  ],

};