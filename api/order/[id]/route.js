// File: app/api/order/[id]/route.js
import { connectDB } from "@/utils/db";
import { getAuthUser } from "@/utils/auth";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const user = await getAuthUser();

  try {
    const order = await Order.findById(params.id)
      .populate("user", "name email")
      .populate("orderItems.productId", "name price image");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
