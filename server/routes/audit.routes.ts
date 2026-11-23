import { Router } from "express";
import { getAuditLogsData } from "../controllers/audit.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = Router();

// admin only 
router.get("/", requireAuth, requireAdmin, getAuditLogsData);

export default router;
