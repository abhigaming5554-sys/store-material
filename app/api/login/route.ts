import { NextResponse }
from "next/server";

import bcrypt
from "bcryptjs";

import jwt
from "jsonwebtoken";

import connectDB
from "@/lib/mongodb";

import User
from "@/models/User";

export async function POST(
  req: Request
) {

  try {

    await connectDB();

    const body =
      await req.json();

    const {
      email,
      password,
    } = body;

    // Validation
    if (
      !email ||
      !password
    ) {

      return NextResponse.json({

        success: false,

        message:
          "All fields required",

      });

    }

    // Find User
    let user =
      await User.findOne({
        email,
      });

    // AUTO CREATE ADMIN
    if (
      !user &&
      email ===
        process.env
          .ADMIN_EMAIL
    ) {

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user =
        await User.create({

          name:
            "Admin",

          email,

          password:
            hashedPassword,

          isAdmin: true,

        });

    }

    // User not found
    if (!user) {

      return NextResponse.json({

        success: false,

        message:
          "User not found",

      });

    }

    // Compare Password
    const isMatch =
      await bcrypt.compare(

        password,

        user.password

      );

    if (!isMatch) {

      return NextResponse.json({

        success: false,

        message:
          "Invalid password",

      });

    }

    // JWT Token
    const token =
      jwt.sign(

        {

          id: user._id,

          email:
            user.email,

          isAdmin:
            user.isAdmin,

        },

        process.env
          .JWT_SECRET ||
          "secret",

        {

          expiresIn:
            "7d",

        }

      );

    // Response
    const response =
      NextResponse.json({

        success: true,

        message:
          "Login successful 😄",

        token,

        user: {

          id: user._id,

          name:
            user.name,

          email:
            user.email,

          isAdmin:
            user.isAdmin,

        },

      });

    // Cookie
    response.cookies.set(

      "token",

      token,

      {

        httpOnly: true,

        secure:
          process.env
            .NODE_ENV ===
          "production",

        sameSite:
          "strict",

        maxAge:
          7 *
          24 *
          60 *
          60,

        path: "/",

      }

    );

    return response;

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}
