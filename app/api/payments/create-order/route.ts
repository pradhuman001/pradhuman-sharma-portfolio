import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { message: "Razorpay server keys are not configured" },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as {
      amountInRupees?: number;
      portfolioReference?: string;
    };

    const amountInRupees = Number(body.amountInRupees || 5);
    const amount = Math.max(1, Math.round(amountInRupees * 100));
    const receipt = `portfolio_${Date.now()}`;

    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt,
        notes: {
          portfolioReference: body.portfolioReference || "portfolio",
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      return NextResponse.json(
        {
          message:
            orderData?.error?.description ||
            orderData?.error?.reason ||
            "Unable to create Razorpay order",
        },
        { status: orderResponse.status }
      );
    }

    return NextResponse.json({
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while creating payment order",
      },
      { status: 500 }
    );
  }
}
