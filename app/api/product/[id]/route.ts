import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Product from "@/models/Product";

export async function GET(

  req: Request,

  { params }: any

) {

  try {

    await connectDB();

    const product =
      await Product.findById(
        params.id
      );

    if (!product) {

      return NextResponse.json({

        success: false,

        message:
          "Product not found",

      });

    }

    return NextResponse.json({

      success: true,

      product,

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