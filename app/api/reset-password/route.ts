import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";

import User from "@/models/User";

export async function POST(req: Request) {

  try {

    await connectDB();

    const body =
      await req.json();

    const {
      email,
      otp,
      password,
    } = body;

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

    // Check OTP
    if (
      user.resetOtp !== otp
    ) {

      return NextResponse.json({

        success: false,

        message:
          "Invalid OTP",

      });

    }

    // Check Expire
    if (
      user.resetOtpExpire <
      Date.now()
    ) {

      return NextResponse.json({

        success: false,

        message:
          "OTP expired",

      });

    }

    // Hash Password
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // Update Password
    user.password =
      hashedPassword;

    user.resetOtp = null;

    user.resetOtpExpire =
      null;

    await user.save();

    return NextResponse.json({

      success: true,

      message:
        "Password reset successful",

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