import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth middleware:", {
    url: req.url,
    method: req.method,
    hasAuthHeader: !!authHeader,
    hasToken: !!token,
    token: token ? `${token.substring(0, 20)}...` : null,
  });

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as {
      userId: string;
    };
    req.userId = decoded.userId;
    console.log("Token verified successfully, userId:", decoded.userId);
    next();
  } catch (error) {
    console.log("Token verification failed:", error instanceof Error ? error.message : error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

