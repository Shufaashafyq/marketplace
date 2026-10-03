import api from "./axios";
import type { Product } from "./product.api";

export type CartItem = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
};

export async function getCart() {
  const response = await api.get("/cart");
  return response.data.cartItems as CartItem[];
}

export async function getCartItemQuantity(productId: string) {
  const response = await api.get(`/cart/${productId}/check`);
  return response.data.quantity as number;
}

export async function addToCart(productId: string, quantity: number = 1) {
  const response = await api.post(`/cart/${productId}`, { quantity });
  return response.data.cartItem as CartItem;
}

export async function updateCartItem(productId: string, quantity: number) {
  const response = await api.put(`/cart/${productId}`, { quantity });
  return response.data.cartItem as CartItem | null;
}

export async function removeFromCart(productId: string) {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
}

export async function getCartCount() {
  const response = await api.get("/cart/count");
  return response.data.count as number;
}

export async function clearCart() {
  const response = await api.delete("/cart");
  return response.data;
}
