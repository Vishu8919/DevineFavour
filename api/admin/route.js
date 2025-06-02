// app/api/admin/route.js

import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/User";
import { getAuthUser } from "@/utils/getAuthUser"; // your auth util
import { isAdmin } from "@/utils/checkAdmin"; // your admin role check util

// Helper to extract userId from URL query
function getUserIdFromUrl(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.searchParams.get("id");
}

// GET /api/admin/users - Get all users (admin only)
export async function GET(req) {
  await connectDB();

  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!isAdmin(user)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// POST /api/admin/users - Add new user (admin only)
export async function POST(req) {
  await connectDB();
  const user = await getAuthUser(req);

  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  try {
    const { name, email, password, role } = await req.json();

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || "customer",
    });

    await newUser.save();
    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// PUT /api/admin/users?id=someuserid - Update user info (admin only)
export async function PUT(req) {
  await connectDB();
  const user = await getAuthUser(req);

  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const userId = getUserIdFromUrl(req.url);
  if (!userId) return NextResponse.json({ message: "User ID is required" }, { status: 400 });

  try {
    const updateData = await req.json();
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) return NextResponse.json({ message: "User not found" }, { status: 404 });

    userToUpdate.name = updateData.name || userToUpdate.name;
    userToUpdate.email = updateData.email || userToUpdate.email;
    userToUpdate.role = updateData.role || userToUpdate.role;

    const updatedUser = await userToUpdate.save();
    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// DELETE /api/admin/users?id=someuserid - Delete user (admin only)
export async function DELETE(req) {
  await connectDB();
  const user = await getAuthUser(req);

  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const userId = getUserIdFromUrl(req.url);
  if (!userId) return NextResponse.json({ message: "User ID is required" }, { status: 400 });

  try {
    const userToDelete = await User.findById(userId);

    if (!userToDelete) return NextResponse.json({ message: "User not found" }, { status: 404 });

    await userToDelete.deleteOne();
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
