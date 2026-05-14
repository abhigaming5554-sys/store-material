import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Order from "@/models/Order";

export async function GET(req: Request) {

  try {

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const email =
      searchParams.get("email");

    const orders = await Order.find({

      userEmail: email,

    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({

      success: true,

      orders,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message: error.message,

    });

  }

}