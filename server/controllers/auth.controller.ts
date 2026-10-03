import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
} from "../services/auth.service";
import { createAuthToken } from "../lib/auth";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function register(
  req: Request,
  res: Response
) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = result.data;

    const user = await registerUser(
      name,
      email,
      password
    );

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "An account with this email already exists"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function login(
  req: Request,
  res: Response
) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password } = result.data;

    const user = await loginUser(email, password);

    const token = createAuthToken({
      userId: user.id,
      role: user.role,
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function me(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const user = await getCurrentUser(req.user!.userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function logout(
  _req: Request,
  res: Response
) {
  try {
    res.clearCookie("auth_token");

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export async function getProfile(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const user = await getCurrentUser(req.user!.userId);

    return res.status(200).json({ user });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function updateProfile(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await updateUserProfile(
      req.user!.userId,
      name
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

//handle http requests/responses