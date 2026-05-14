import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import User from "@/models/User";

import Product from "@/models/Product";

import Order from "@/models/Order";

export async function GET() {

  try {

    await connectDB();

    // Counts
    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    // Revenue
    const orders =
      await Order.find();

    const totalRevenue =
      orders.reduce(

        (acc, item) =>

          acc + item.price,

        0

      );

    return NextResponse.json({

      success: true,

      totalUsers,

      totalProducts,

      totalOrders,

      totalRevenue,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}