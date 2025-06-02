// File: app/api/checkout/route.js
import { connectDB } from "@/utils/db";
import { getAuthUser } from "@/utils/auth";
import Checkout from "@/models/Checkout";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const user = await getAuthUser();
  const body = await req.json();

  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return NextResponse.json({ message: "No items in checkout" }, { status: 400 });
  }

  try {
    const newCheckout = await Checkout.create({
      user: user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    return NextResponse.json(newCheckout, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
