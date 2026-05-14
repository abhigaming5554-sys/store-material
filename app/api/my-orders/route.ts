import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Order from "@/models/Order";

import jwt from "jsonwebtoken";

export async function GET(req: Request) {

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
        process.env.JWT_SECRET!
      );

    const orders =
      await Order.find({

        userEmail:
          decoded.email,

      }).sort({
        createdAt: -1,
      });

    return NextResponse.json({

      success: true,

      orders,

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