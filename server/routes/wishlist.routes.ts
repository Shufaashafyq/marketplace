import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getWishlist,
  checkWishlistItem,
  addWishlistItem,
  removeWishlistItem,
  getWishlistLength,
} from "../controllers/wishlist.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getWishlist);
router.get("/count", getWishlistLength);
router.get("/:productId/check", checkWishlistItem);
router.post("/:productId", addWishlistItem);
router.delete("/:productId", removeWishlistItem);

export default router;
