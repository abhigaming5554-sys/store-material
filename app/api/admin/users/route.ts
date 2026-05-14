import { NextResponse }
from "next/server";

import jwt from "jsonwebtoken";

import connectDB
from "@/lib/mongodb";

import User
from "@/models/User";

export async function GET(
  req: Request
) {

  try {

    await connectDB();

    const token =
      req.headers
        .get("authorization")
        ?.split(" ")[1];

    if (!token) {

      return NextResponse.json({

        success: false,

        message:
          "No token",

      });

    }

    const decoded: any =
      jwt.verify(

        token,

        process.env
          .JWT_SECRET || "secret"

      );

    // Only admin check (simple)
    const admin =
      await User.findById(
        decoded.id
      );

    if (
      !admin ||
      admin.email !==
        "admin@gmail.com"
    ) {

      return NextResponse.json({

        success: false,

        message:
          "Not authorized",

      });

    }

    const users =
      await User.find()
        .select("-password");

    return NextResponse.json({

      success: true,

      users,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}