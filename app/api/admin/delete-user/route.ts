import { NextResponse }
from "next/server";

import jwt from "jsonwebtoken";

import connectDB
from "@/lib/mongodb";

import User
from "@/models/User";

export async function POST(
  req: Request
) {

  try {

    await connectDB();

    const token =
      req.headers
        .get("authorization")
        ?.split(" ")[1];

    const body =
      await req.json();

    const { userId } = body;

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

    await User.findByIdAndDelete(
      userId
    );

    return NextResponse.json({

      success: true,

      message:
        "User deleted 😄",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}