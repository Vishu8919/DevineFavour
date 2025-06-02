// File: app/api/order/route.js
import { connectDB } from "@/utils/db";
import { getAuthUser } from "@/utils/auth";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const user = await getAuthUser();

  try {
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
