// File: /api/product/route.js

import { connectDB } from "@/utils/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const query = {};
  const filterKeys = ["collection", "category", "material", "brand", "size", "color", "gender"];
  
  filterKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value && value.toLowerCase() !== "all") {
      query[key === "size" || key === "brand" || key === "material" ? key : key] =
        key === "size" || key === "brand" || key === "material"
          ? { $in: value.split(",") }
          : value;
    }
  });

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const search = searchParams.get("search");
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortBy = searchParams.get("sortBy");
  let sort = {};
  switch (sortBy) {
    case "priceAsc":
      sort = { price: 1 };
      break;
    case "priceDesc":
      sort = { price: -1 };
      break;
    case "popularity":
      sort = { rating: -1 };
      break;
  }

  const limit = Number(searchParams.get("limit")) || 0;

  try {
    const products = await Product.find(query).sort(sort).limit(limit);
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
