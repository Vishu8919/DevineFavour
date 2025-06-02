// app/api/admin/adminOrder/route.js

import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import { getAuthUser } from "@/utils/getAuthUser"; // your auth util
import { isAdmin } from "@/utils/checkAdmin"; // your admin role check util

function getOrderIdFromUrl(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.searchParams.get("id");
}

// GET /api/admin/adminOrder - get all orders (admin only)
export async function GET(req) {
  await connectDB();

  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!isAdmin(user)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const orders = await Order.find({}).populate("user", "name email");
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// PUT /api/admin/adminOrder?id=ORDER_ID - update order status (admin only)
export async function PUT(req) {
  await connectDB();

  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const orderId = getOrderIdFromUrl(req.url);
  if (!orderId) return NextResponse.json({ message: "Order ID is required" }, { status: 400 });

  try {
    const order = await Order.findById(orderId).populate("user", "name");
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    const { status } = await req.json();

    if (status) {
      order.status = status;
      order.isDelivered = status === "Delivered";
      order.deliveredAt = status === "Delivered" ? Date.now() : order.deliveredAt;
    }

    const updatedOrder = await order.save();
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// DELETE /api/admin/adminOrder?id=ORDER_ID - delete an order (admin only)
export async function DELETE(req) {
  await connectDB();

  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const orderId = getOrderIdFromUrl(req.url);
  if (!orderId) return NextResponse.json({ message: "Order ID is required" }, { status: 400 });

  try {
    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    await order.deleteOne();
    return NextResponse.json({ message: "Order Removed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
