// File: /api/product/admin/route.js

import { connectDB } from "@/utils/db";
import Product from "@/models/Product";
import { getAuthUser } from "@/utils/auth"; // should validate token and role
import { NextResponse } from "next/server";

// POST /api/product/admin - Create Product
export async function POST(req) {
  await connectDB();
  const user = await getAuthUser(req, { adminOnly: true });

  try {
    const body = await req.json();

    const product = new Product({
      ...body,
      user: user._id,
    });

    const createdProduct = await product.save();
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
