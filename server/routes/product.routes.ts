import { Router } from "express";
import { create, getAll, getOne, update, remove,} from "../controllers/product.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import upload from "../middleware/upload.middleware";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", requireAuth, requireAdmin, upload.array("images", 10), create);
router.put("/:id", requireAuth, requireAdmin, upload.array("images", 10), update);
router.delete("/:id", requireAuth, requireAdmin, remove);

export default router;

