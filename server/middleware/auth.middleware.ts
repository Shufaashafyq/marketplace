import { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "../lib/auth";

export type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    role: "USER" | "ADMIN";
  };
};

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const payload = verifyAuthToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
}

//authorization