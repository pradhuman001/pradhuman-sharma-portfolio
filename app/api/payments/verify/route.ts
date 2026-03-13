import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json(
      { verified: false, message: "Razorpay secret is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const orderId = body.razorpay_order_id || "";
    const paymentId = body.razorpay_payment_id || "";
    const signature = body.razorpay_signature || "";

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { verified: false, message: "Invalid payment verification payload" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const verified =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf8"),
        Buffer.from(signature, "utf8")
      );

    return NextResponse.json({ verified });
  } catch (error) {
    return NextResponse.json(
      {
        verified: false,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected verification error",
      },
      { status: 500 }
    );
  }
}
