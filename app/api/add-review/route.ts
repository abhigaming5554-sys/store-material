import { NextResponse }
from "next/server";

import jwt
from "jsonwebtoken";

import connectDB
from "@/lib/mongodb";

import Review
from "@/models/Review";

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
          "Login required",

      });

    }

    const decoded: any =
      jwt.verify(

        token,

        process.env
          .JWT_SECRET ||
          "secret"

      );

    const user =
      await User.findById(
        decoded.id
      );

    const body =
      await req.json();

    const {

      productId,

      rating,

      comment,

    } = body;

    await Review.create({

      productId,

      userId:
        decoded.id,

      name:
        user.name,

      rating,

      comment,

    });

    return NextResponse.json({

      success: true,

      message:
        "Review added 😄",

    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}