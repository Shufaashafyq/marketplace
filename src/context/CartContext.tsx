import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "../api/cart.api";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  getCartCount,
  clearCart,
} from "../api/cart.api";
import { useAuth } from "./AuthContext";

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  getItemQuantity: (productId: string) => number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function refreshCart() {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    setLoading(true);
    try {
      const [items, count] = await Promise.all([
        getCart(),
        getCartCount(),
      ]);
      setCartItems(items);
      setCartCount(count);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(productId: string, quantity: number = 1) {
    try {
      const cartItem = await addToCart(productId, quantity);
      setCartItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) {
          return current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [cartItem, ...current];
      });
      setCartCount((current) => current + quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  }

  async function updateItem(productId: string, quantity: number) {
    try {
      const result = await updateCartItem(productId, quantity);
      if (quantity <= 0 || !result) {
        setCartItems((current) =>
          current.filter((item) => item.productId !== productId)
        );
        const oldItem = cartItems.find((item) => item.productId === productId);
        if (oldItem) {
          setCartCount((current) => Math.max(0, current - oldItem.quantity));
        }
      } else {
        setCartItems((current) =>
          current.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
        const oldItem = cartItems.find((item) => item.productId === productId);
        if (oldItem) {
          setCartCount(
            (current) => current - oldItem.quantity + quantity
          );
        }
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
      throw error;
    }
  }

  async function removeItem(productId: string) {
    try {
      await removeFromCart(productId);
      const item = cartItems.find((i) => i.productId === productId);
      setCartItems((current) =>
        current.filter((i) => i.productId !== productId)
      );
      if (item) {
        setCartCount((current) => Math.max(0, current - item.quantity));
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  }

  async function clear() {
    try {
      await clearCart();
      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  }

  function getItemQuantity(productId: string) {
    return cartItems.find((item) => item.productId === productId)?.quantity ?? 0;
  }

  useEffect(() => {
    refreshCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        getItemQuantity,
        addItem,
        updateItem,
        removeItem,
        clear,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
