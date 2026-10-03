import api from "./axios";
import type { Product } from "./product.api";

export async function getWishlist() {
  const response = await api.get("/wishlist");
  return response.data.products as Product[];
}

export async function isProductLiked(productId: string) {
  const response = await api.get(`/wishlist/${productId}/check`);
  return response.data.isLiked as boolean;
}

export async function addToWishlist(productId: string) {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data.product as Product;
}

export async function removeFromWishlist(productId: string) {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
}

export async function getWishlistCount() {
  const response = await api.get("/wishlist/count");
  return response.data.count as number;
}
