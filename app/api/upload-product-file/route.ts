import { NextResponse }
from "next/server";

import cloudinary
from "@/lib/cloudinary";

export async function POST(
  req: Request
) {

  try {

    const formData =
      await req.formData();

    const file =
      formData.get(
        "file"
      ) as File;

    if (!file) {

      return NextResponse.json({

        success: false,

        message:
          "No file selected",

      });

    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const base64 =
      `data:${file.type};base64,${buffer.toString("base64")}`;

    const upload =
      await cloudinary.uploader.upload(

        base64,

        {

          resource_type:
            "raw",

          folder:
            "store-material/files",

        }

      );

    return NextResponse.json({

      success: true,

      url: upload.secure_url,

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