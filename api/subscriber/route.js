// /api/subscriber/route.js
import { NextResponse } from "next/server";
import Subscriber from "@/lib/models/Subscriber";
import dbConnect from "@/lib/db";

// POST /api/subscriber
export async function POST(req) {
  await dbConnect(); // Ensure DB connection

  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return NextResponse.json(
        { message: "Email is already subscribed" },
        { status: 400 }
      );
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    return NextResponse.json(
      { message: "Successfully subscribed to the newsletter" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
