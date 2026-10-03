import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getCart,
  checkCartItem,
  addCartItem,
  updateCart,
  removeCartItem,
  getCartLength,
  clearUserCart,
} from "../controllers/cart.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getCart);
router.get("/count", getCartLength);
router.get("/:productId/check", checkCartItem);
router.post("/:productId", addCartItem);
router.put("/:productId", updateCart);
router.delete("/:productId", removeCartItem);
router.delete("/", clearUserCart);

export default router;
