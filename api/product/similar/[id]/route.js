// File: /api/product/similar/[id]/route.js

import { connectDB } from "@/utils/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const current = await Product.findById(params.id);
    if (!current) {
      return NextResponse.json({ message: "Product Not Found" }, { status: 404 });
    }

    const similar = await Product.find({
      _id: { $ne: current._id },
      gender: current.gender,
      category: current.category,
    }).limit(4);

    return NextResponse.json(similar);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
