import { NextResponse }
from "next/server";

import connectDB
from "@/lib/mongodb";

import Product
from "@/models/Product";

import {
  verifyAdmin,
} from "@/lib/adminAuth";

export async function POST(
  req: Request
) {

  try {

    await connectDB();

    const token =
      req.headers

        .get("authorization")

        ?.replace(
          "Bearer ",
          ""
        );

    if (!token) {

      return NextResponse.json({

        success: false,

        message:
          "No token",

      });

    }

    const admin =
      verifyAdmin(
        token
      );

    if (!admin) {

      return NextResponse.json({

        success: false,

        message:
          "Unauthorized",

      });

    }

    const body =
      await req.json();

    const product =
      await Product.create({

        title:
          body.title,

        description:
          body.description,

        price:
          body.price,

        category:
          body.category,

        thumbnail:
          body.thumbnail,

        previewVideo:
          body.previewVideo,

        fileUrl:
          body.fileUrl,

      });

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