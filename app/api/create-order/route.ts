import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { amount } = body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order",
    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });

  }

}