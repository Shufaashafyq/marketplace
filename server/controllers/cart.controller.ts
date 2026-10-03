import type { Request, Response } from "express";
import {
  getUserCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartCount,
  clearCart,
  getCartItemQuantity,
} from "../services/cart.service";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export async function getCart(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const cartItems = await getUserCart(userId);
    res.json({ cartItems });
  } catch (error) {
    console.error("Failed to get cart:", error);
    res.status(500).json({ message: "Failed to get cart" });
  }
}

export async function checkCartItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const { productId } = req.params as { productId: string };

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const quantity = await getCartItemQuantity(userId, productId);
    res.json({ quantity });
  } catch (error) {
    console.error("Failed to check cart item:", error);
    res
      .status(500)
      .json({ message: "Failed to check cart item" });
  }
}

export async function addCartItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const { productId } = req.params as { productId: string };
  const { quantity = 1 } = req.body as { quantity?: number };

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const cartItem = await addToCart(userId, productId, quantity);
    res.json({ cartItem });
  } catch (error) {
    console.error("Failed to add to cart:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
}

export async function updateCart(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const { productId } = req.params as { productId: string };
  const { quantity } = req.body as { quantity: number };

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const cartItem = await updateCartItemQuantity(userId, productId, quantity);
    res.json({ cartItem });
  } catch (error) {
    console.error("Failed to update cart:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
}

export async function removeCartItem(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  const { productId } = req.params as { productId: string };

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await removeFromCart(userId, productId);
    res.json({ message: "Removed from cart" });
  } catch (error) {
    console.error("Failed to remove from cart:", error);
    res
      .status(500)
      .json({ message: "Failed to remove from cart" });
  }
}

export async function getCartLength(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const count = await getCartCount(userId);
    res.json({ count });
  } catch (error) {
    console.error("Failed to get cart count:", error);
    res
      .status(500)
      .json({ message: "Failed to get cart count" });
  }
}

export async function clearUserCart(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await clearCart(userId);
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Failed to clear cart:", error);
    res
      .status(500)
      .json({ message: "Failed to clear cart" });
  }
}
