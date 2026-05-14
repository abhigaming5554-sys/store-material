import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Product from "@/models/Product";

export async function DELETE(req: Request) {

  try {

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const id = searchParams.get("id");

    await Product.findByIdAndDelete(id);

    return NextResponse.json({

      success: true,

      message: "Product deleted",

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message: error.message,

    });

  }

}