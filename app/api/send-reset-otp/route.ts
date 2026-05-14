import { NextResponse } from "next/server";

import nodemailer from "nodemailer";

import connectDB from "@/lib/mongodb";

import User from "@/models/User";

export async function POST(req: Request) {

  try {

    await connectDB();

    const body =
      await req.json();

    const { email } = body;

    if (!email) {

      return NextResponse.json({

        success: false,

        message:
          "Email required",

      });

    }

    // Find User
    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return NextResponse.json({

        success: false,

        message:
          "User not found",

      });

    }

    // Generate OTP
    const otp =
      Math.floor(
        100000 +
          Math.random() *
            900000
      ).toString();

    // Save OTP
    user.resetOtp = otp;

    user.resetOtpExpire =
      Date.now() +
      10 * 60 * 1000;

    await user.save();

    // Gmail Transport
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

    // Send Email
    await transporter.sendMail({

      from:
        process.env
          .EMAIL_USER,

      to: email,

      subject:
        "Password Reset OTP",

      html: `

      <div style="font-family:sans-serif;padding:20px;">

        <h2>Password Reset OTP 🔐</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP expires in 10 minutes.</p>

      </div>

      `,

    });

    return NextResponse.json({

      success: true,

      message:
        "OTP sent successfully",

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