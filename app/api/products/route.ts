import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();

    const {
      title,
      description,
      price,
      category,
      thumbnail,
      fileUrl,
      previewVideo,
    } = body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      thumbnail,
      fileUrl,
      previewVideo,
    });

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });

  }

}