import { NextResponse }
from "next/server";

import jwt from "jsonwebtoken";

import connectDB
from "@/lib/mongodb";

import Order
from "@/models/Order";

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
          .JWT_SECRET || "secret"

      );

    const body =
      await req.json();

    const {
      productId,
    } = body;

    const order =
      await Order.findOne({

        userId:
          decoded.id,

        productId,

      });

    if (!order) {

      return NextResponse.json({

        success: false,

        message:
          "Purchase required",

      });

    }

    return NextResponse.json({

      success: true,

      fileUrl:
        order.fileUrl,

      token:
        order.downloadToken,

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