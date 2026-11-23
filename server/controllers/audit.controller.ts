import { Request, Response } from "express";
import { getAuditLogs } from "../services/audit.service";

export async function getAuditLogsData(
  _req: Request,
  res: Response
) {
  try {
    const logs = await getAuditLogs();

    return res.status(200).json({
      message: "Audit logs retrieved successfully",
      logs,
    });
  } catch (error) {
    console.error("Failed to retrieve audit logs:", error);

    return res.status(500).json({
      message: "Failed to retrieve audit logs",
    });
  }
}
