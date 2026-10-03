import api from "./axios";
import type { Product } from "./product.api";

export type InventorySummary = {
  totalUnits: number;
  lowStock: number;
  outOfStock: number;
  inStock: number;
};

export type InventoryResponse = {
  summary: InventorySummary;
  products: Product[];
};

export async function getInventory() {
  const response = await api.get("/inventory");

  return response.data as InventoryResponse;
}

export async function updateInventoryStock(
  productId: string,
  stock: number
) {
  const response = await api.patch(
    `/inventory/${productId}`,
    { stock }
  );

  return response.data.product as Product;
}