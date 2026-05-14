import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import User from "@/models/User";

import bcrypt from "bcryptjs";

export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      phone,
      password,
    } = body;

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {

      return NextResponse.json({

        success: false,

        message:
          "Fill all fields",

      });

    }

    // Phone validation
    if (phone.length < 10) {

      return NextResponse.json({

        success: false,

        message:
          "Invalid phone number",

      });

    }

    // Existing user
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return NextResponse.json({

        success: false,

        message:
          "Email already exists",

      });

    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    await User.create({

      name,

      email,

      phone,

      password: hashedPassword,

    });

    return NextResponse.json({

      success: true,

      message:
        "Signup successful",

    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({

      success: false,

      message: error.message,

    });

  }

}