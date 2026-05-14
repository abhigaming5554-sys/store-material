import { NextResponse }
from "next/server";

import cloudinary
from "@/lib/cloudinary";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {

      file,

    } = body;

    if (!file) {

      return NextResponse.json({

        success: false,

        message:
          "File required",

      });

    }

    const uploaded =
      await cloudinary.uploader.upload(

        file,

        {

          resource_type:
            "auto",

          folder:
            "store-material",

        }

      );

    return NextResponse.json({

      success: true,

      url:
        uploaded.secure_url,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message:
        error.message,

    });

  }

}