import api from "./axios";

export type AuditLog = {
  id: string;
  action: string;
  adminId: string | null;
  adminName: string;
  entityType: string;
  entityId: string | null;
  entityName: string;
  details: Record<string, unknown> | null;
  createdAt: string;
};

export async function getAuditLogs() {
  const response = await api.get("/audit");

  return response.data.logs as AuditLog[];
}
