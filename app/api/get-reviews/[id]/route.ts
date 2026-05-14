import { NextResponse }
from "next/server";

import connectDB
from "@/lib/mongodb";

import Review
from "@/models/Review";

export async function POST(
  req: Request
) {

  try {

    await connectDB();

    const body =
      await req.json();

    const {
      productId,
    } = body;

    const reviews =
      await Review.find({

        productId,

      }).sort({

        createdAt: -1,

      });

    return NextResponse.json({

      success: true,

      reviews,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}