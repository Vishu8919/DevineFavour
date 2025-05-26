import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return Response.json({ message: "Invalid credentials" }, { status: 400 });

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
    });

  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server Error" }, { status: 500 });
  }
}
