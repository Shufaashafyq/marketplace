import type { AuditLog } from "../../../api/audit.api";

function formatAction(action: string) {
  return action
    .split("_")
    .map(
      (word) =>
        word.charAt(0) + word.slice(1).toLowerCase()
    )
    .join(" ");
}

function getActionStyle(action: string) {
  switch (action) {
    case "CREATE_PRODUCT":
      return "bg-[#EAF5ED] text-[#1E5C35]";

    case "UPDATE_PRODUCT":
    case "UPDATE_STOCK":
      return "bg-[#EAF0FA] text-[#315A91]";

    case "DELETE_PRODUCT":
      return "bg-[#FBE8EC] text-[#8B1A1A]";

    default:
      return "bg-[#F3EAF5] text-[#560319]";
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-MV", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatRelativeTime(date: string) {
  const difference = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;

  return formatDate(date);
}

function getDetails(log: AuditLog) {
  const details = log.details;

  if (!details) return "No additional details";

  if (
    typeof details.oldStock === "number" &&
    typeof details.newStock === "number"
  ) {
    return `Stock: ${details.oldStock} → ${details.newStock}`;
  }

  if (
    log.action === "CREATE_PRODUCT" ||
    log.action === "DELETE_PRODUCT"
  ) {
    return `Price: ${details.price ?? "—"} | Stock: ${details.stock ?? "—"}`;
  }

  if (log.action === "UPDATE_PRODUCT") {
    return "Product information updated";
  }

  return "Activity recorded";
}

export function getAuditLogColumns() {
  return [
    {
      accessorKey: "action",
      header: "Activity",
      cell: ({ row }: any) => {
        const action = row.original.action as string;

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getActionStyle(action)}`}
          >
            {formatAction(action)}
          </span>
        );
      },
    },

    {
      accessorKey: "adminName",
      header: "Admin",
      cell: ({ row }: any) => (
        <span className="text-sm font-medium text-[#560319]">
          {row.original.adminName}
        </span>
      ),
    },

    {
      accessorKey: "entityName",
      header: "Resource",
      cell: ({ row }: any) => {
        const log = row.original as AuditLog;

        return (
          <div>
            <p className="text-sm font-medium text-[#560319]">
              {log.entityName}
            </p>

            <p className="mt-0.5 text-xs text-[#A290B7]">
              {log.entityType}
            </p>
          </div>
        );
      },
    },

    {
      id: "details",
      header: "Details",
      enableSorting: false,

      cell: ({ row }: any) => (
        <span className="text-sm text-[#8F8585]">
          {getDetails(row.original as AuditLog)}
        </span>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }: any) => {
        const date = row.original.createdAt as string;

        return (
          <span
            title={formatDate(date)}
            className="whitespace-nowrap text-xs text-[#8F8585]"
          >
            {formatRelativeTime(date)}
          </span>
        );
      },
    },
  ];
}
