import type { Response } from "express";
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistCount,
  isProductInWishlist,
} from "../services/wishlist.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function getWishlist(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const products = await getUserWishlist(userId);
    res.json({ products });
  } catch (error) {
    console.error("Failed to get wishlist:", error);
    res.status(500).json({ message: "Failed to get wishlist" });
  }
}

export async function checkWishlistItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const { productId } = req.params as { productId: string };

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const isLiked = await isProductInWishlist(userId, productId);
    res.json({ isLiked });
  } catch (error) {
    console.error("Failed to check wishlist item:", error);
    res
      .status(500)
      .json({ message: "Failed to check wishlist item" });
  }
}

export async function addWishlistItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const { productId } = req.params as { productId: string };

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const product = await addToWishlist(userId, productId);
    res.json({ product });
  } catch (error) {
    console.error("Failed to add to wishlist:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
}

export async function removeWishlistItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const { productId } = req.params as { productId: string };

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await removeFromWishlist(userId, productId);
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Failed to remove from wishlist:", error);
    res
      .status(500)
      .json({ message: "Failed to remove from wishlist" });
  }
}

export async function getWishlistLength(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const count = await getWishlistCount(userId);
    res.json({ count });
  } catch (error) {
    console.error("Failed to get wishlist count:", error);
    res
      .status(500)
      .json({ message: "Failed to get wishlist count" });
  }
}
