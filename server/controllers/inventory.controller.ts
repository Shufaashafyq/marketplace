import type { Request, Response } from "express";
import {
  getInventory,
  updateInventoryStock,
} from "../services/inventory.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";
import { createLog } from "../services/audit.service";

//call getInventory() from service
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
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const productId = req.params.productId as string;
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

    // Get the product's current stock before updating
    const currentProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!currentProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Update product stock
    const product = await updateInventoryStock(
      productId,
      stock
    );

    // Get the admin who performed the action
    const admin = await prisma.user.findUnique({
      where: {
        id: req.user!.userId,
      },
      select: {
        name: true,
      },
    });

    // Record the audit log
    if (admin) {
      try {
        await createLog({
          action: "UPDATE_STOCK",
          adminId: req.user!.userId,
          adminName: admin.name,
          entityType: "PRODUCT",
          entityId: product.id,
          entityName: product.name,
          details: {
            oldStock: currentProduct.stock,
            newStock: product.stock,
          },
        });
      } catch (auditError) {
        console.error("Failed to create stock audit log:", auditError);
      }
    }

    return res.json({
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

    return res.status(500).json({
      message: "Failed to update stock",
    });
  }
}


//GET /api/inventory -after successfull authentication, authorization