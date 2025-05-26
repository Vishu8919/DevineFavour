import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  try {
    let user = await User.findOne({ email });
    if (user) return Response.json({ message: "User already exists" }, { status: 400 });

    user = await User.create({ name, email, password });

    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" });

    return Response.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }, { status: 201 });

  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server Error" }, { status: 500 });
  }
}
