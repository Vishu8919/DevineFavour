import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await connectDB();
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");
    return Response.json(user);
  } catch (err) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }
}
