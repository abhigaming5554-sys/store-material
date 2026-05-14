import { NextResponse }
from "next/server";

import jwt from "jsonwebtoken";

import bcrypt
from "bcryptjs";

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

    const body =
      await req.json();

    const {

      name,

      password,

      profileImage,

    } = body;

    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {

      return NextResponse.json({

        success: false,

        message:
          "User not found",

      });

    }

    // Update Name
    if (name) {

      user.name = name;

    }

    // Update Password
    if (
      password &&
      password.length >= 6
    ) {

      const hashed =
        await bcrypt.hash(

          password,

          10

        );

      user.password =
        hashed;

    }

    // Update Image
    if (profileImage) {

      user.profileImage =
        profileImage;

    }

    await user.save();

    return NextResponse.json({

      success: true,

      message:
        "Profile updated 😄",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}