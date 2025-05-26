// lib/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";

// Middleware to protect API routes
export const protect = async (req) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Not authorized, token failed");
  }
};

// Middleware to check if user is admin
export const isAdmin = (user) => {
  if (!user || user.role !== "admin") {
    throw new Error("Not authorized as an admin");
  }
};
