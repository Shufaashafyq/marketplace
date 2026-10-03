import type { Request, Response } from "express";

import {
  getInventory,
  updateInventoryStock,
} from "../services/inventory.service";

export async function getInventoryData(
  _req: Request,
  res: Response
) {
  try {
    const inventory = await getInventory();

    res.json(inventory);
  } catch (error) {
    console.error("Failed to load inventory:", error);

    res.status(500).json({
      message: "Failed to load inventory",
    });
  }
}

export async function updateStock(
  req: Request<{ productId: string }>,
  res: Response
) {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    if (
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        message: "Stock must be a non-negative whole number",
      });
    }

    const product = await updateInventoryStock(
      productId,
      stock
    );

    res.json({
      product,
      message: "Stock updated successfully",
    });
  } catch (error: any) {
    if (error.message === "Product not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error("Failed to update stock:", error);

    res.status(500).json({
      message: "Failed to update stock",
    });
  }
}