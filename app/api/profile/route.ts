import { NextResponse }
from "next/server";

import jwt from "jsonwebtoken";

import connectDB
from "@/lib/mongodb";

import User
from "@/models/User";

import Order
from "@/models/Order";

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

    // Verify Token
    const decoded: any =
      jwt.verify(

        token,

        process.env
          .JWT_SECRET || "secret"

      );

    // User
    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    // Orders
    const orders =
      await Order.find({

        userId:
          decoded.id,

      });

    return NextResponse.json({

      success: true,

      user,

      orders,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}