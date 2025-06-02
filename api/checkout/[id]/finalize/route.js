// File: app/api/checkout/[id]/finalize/route.js
import { connectDB } from "@/utils/db";
import { getAuthUser } from "@/utils/auth";
import Checkout from "@/models/Checkout";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB();
  await getAuthUser();

  try {
    const checkout = await Checkout.findById(params.id);
    if (!checkout) {
      return NextResponse.json({ message: "Checkout not found" }, { status: 404 });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = new Date();
      await checkout.save();

      return NextResponse.json(finalOrder, { status: 201 });
    } else if (checkout.isFinalized) {
      return NextResponse.json({ message: "Checkout already finalized" }, { status: 400 });
    } else {
      return NextResponse.json({ message: "Checkout is not paid" }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
