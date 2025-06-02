// File: app/api/checkout/[id]/pay/route.js
import { connectDB } from "@/utils/db";
import { getAuthUser } from "@/utils/auth";
import Checkout from "@/models/Checkout";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();
  await getAuthUser();
  const { paymentStatus, paymentDetails } = await req.json();

  if (!paymentStatus || !paymentDetails) {
    return NextResponse.json({ message: "Payment status or details missing" }, { status: 400 });
  }

  try {
    const checkout = await Checkout.findById(params.id);
    if (!checkout) {
      return NextResponse.json({ message: "Checkout not found" }, { status: 404 });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = "paid";
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();

      await checkout.save();
      return NextResponse.json({ message: "Payment successful", checkout }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid payment status" }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
