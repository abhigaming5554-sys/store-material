import { NextResponse }
from "next/server";

import jwt
from "jsonwebtoken";

import { v4 as uuidv4 }
from "uuid";

import nodemailer
from "nodemailer";

import connectDB
from "@/lib/mongodb";

import Order
from "@/models/Order";

import User
from "@/models/User";

export async function POST(
  req: Request
) {

  try {

    await connectDB();

    // Auth Token
    const authHeader =
      req.headers.get(
        "authorization"
      );

    const token =
      authHeader?.split(
        " "
      )[1];

    if (!token) {

      return NextResponse.json({

        success: false,

        message:
          "Login required",

      });

    }

    // Verify JWT
    const decoded: any =
      jwt.verify(

        token,

        process.env
          .JWT_SECRET ||
          "secret"

      );

    // Find User
    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {

      return NextResponse.json({

        success: false,

        message:
          "User not found",

      });

    }

    // Request Body
    const body =
      await req.json();

    const {

      productId,

      title,

      price,

      fileUrl,

      paymentId,

    } = body;

    // Validation
    if (

      !productId ||

      !title ||

      !price ||

      !fileUrl ||

      !paymentId

    ) {

      return NextResponse.json({

        success: false,

        message:
          "All fields required",

      });

    }

    // Generate Secure Download Token
    const downloadToken =
      uuidv4();

    // Save Order
    const order =
      await Order.create({

        userId:
          decoded.id,

        productId,

        title,

        price,

        fileUrl,

        paymentId,

        downloadToken,

      });

    // Email Transport
    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {

          user:
            process.env
              .EMAIL_USER,

          pass:
            process.env
              .EMAIL_PASS,

        },

      });

    // Send Success Email
    await transporter.sendMail({

      from:
        process.env
          .EMAIL_USER,

      to: user.email,

      subject:
        "Payment Successful 🎉",

      html: `

      <div style="font-family:sans-serif;padding:20px;">

        <h1>
          Payment Successful 😄
        </h1>

        <p>
          Thanks for your purchase.
        </p>

        <hr />

        <h2>
          Product:
          ${title}
        </h2>

        <h3>
          Price:
          ₹${price}
        </h3>

        <p>
          Your order has been confirmed 🎉
        </p>

      </div>

      `,

    });

    return NextResponse.json({

      success: true,

      message:
        "Order saved 😄",

      order,

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