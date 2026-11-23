import prisma from "../lib/prisma";

type CreateLogInput = {
  action: string;
  adminId?: string | null;
  adminName: string;
  entityType: string;
  entityId?: string | null;
  entityName: string;
  details?: Record<string, unknown> | null;
};

export async function createLog(data: CreateLogInput) {
  return prisma.auditLog.create({
    data: {
      action: data.action,
      adminId: data.adminId ?? null,
      adminName: data.adminName,
      entityType: data.entityType,
      entityId: data.entityId ?? null,
      entityName: data.entityName,
      details: data.details
        ? JSON.parse(JSON.stringify(data.details))
        : undefined,
    },
  });
}

export async function getAuditLogs() {
  return prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

//create audit logs, retreive them