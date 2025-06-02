// File: /api/product/new-arrivals/route.js

import { connectDB } from "@/utils/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    return NextResponse.json(newArrivals);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
