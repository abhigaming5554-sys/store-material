import { NextResponse }
from "next/server";

import jwt
from "jsonwebtoken";

import connectDB
from "@/lib/mongodb";

import Product
from "@/models/Product";

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
          .JWT_SECRET ||
          "secret"

      );

    const admin =
      await User.findById(
        decoded.id
      );

    if (
      !admin ||
      admin.email !==
        "abhigaming5554@gmail.com"
    ) {

      return NextResponse.json({

        success: false,

        message:
          "Unauthorized",

      });

    }

    const body =
      await req.json();

    const {

      productId,

      title,

      description,

      price,

      category,

      thumbnail,

      previewVideo,

      fileUrl,

    } = body;

    const updated =
      await Product.findByIdAndUpdate(

        productId,

        {

          title,

          description,

          price,

          category,

          thumbnail,

          previewVideo,

          fileUrl,

        },

        {

          new: true,

        }

      );

    return NextResponse.json({

      success: true,

      message:
        "Product updated 😄",

      product:
        updated,

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