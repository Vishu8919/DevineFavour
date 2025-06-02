// File: /api/product/best-seller/route.js

import { connectDB } from "@/utils/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (!bestSeller) {
      return NextResponse.json({ message: "No Best Seller Found" }, { status: 404 });
    }
    return NextResponse.json(bestSeller);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
