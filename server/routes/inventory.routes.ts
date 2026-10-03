import { Router } from "express";
import {
  getInventoryData,
  updateStock,
} from "../controllers/inventory.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireAdmin,
  getInventoryData
);

router.patch(
  "/:productId",
  requireAuth,
  requireAdmin,
  updateStock
);

export default router;

//inventory available for admin only