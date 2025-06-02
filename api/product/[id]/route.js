// File: /api/product/[id]/route.js

import { connectDB } from "@/utils/db";
import Product from "@/models/Product";
import { getAuthUser } from "@/utils/auth";
import { NextResponse } from "next/server";

// PUT /api/product/:id - Update product
export async function PUT(req, { params }) {
  await connectDB();
  const user = await getAuthUser(req, { adminOnly: true });
  const { id } = params;
  const data = await req.json();

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    Object.assign(product, data);
    const updatedProduct = await product.save();
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// DELETE /api/product/:id - Delete product
export async function DELETE(req, { params }) {
  await connectDB();
  const user = await getAuthUser(req, { adminOnly: true });
  const { id } = params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    await product.deleteOne();
    return NextResponse.json({ message: "Product Removed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}


// GET /api/product/:id
export async function GET(req, { params }) {
  await connectDB();

  try {
    if (params.id === "best-seller") {
      return NextResponse.json({ message: "this should work" });
    }

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: "Product Not Found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
