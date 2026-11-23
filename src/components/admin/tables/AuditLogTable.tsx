import { useState } from "react";
import {
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { AuditLog } from "@/api/audit.api";
import { getAuditLogColumns } from "./AuditLogTableColumns";

type AuditLogTableProps = {
  logs: AuditLog[];
};

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

function AuditLogTable({ logs }: AuditLogTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting, setSorting] = useState([
    { id: "createdAt", desc: true },
  ]);

  const columns = getAuditLogColumns();

  const table = useTable({
    key: "audit-log-table",
    features,
    data: logs,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    autoResetPageIndex: false,
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-[#E8DDE8]">
        <table className="w-full min-w-212.5text-left text-sm">
          <thead className="bg-[#F8F4F8] text-[#6B586B]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();

                  return (
                    <th
                      key={header.id}
                      className="px-5 py-4 font-semibold"
                    >
                      <button
                        type="button"
                        disabled={!canSort}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`inline-flex items-center gap-2 ${
                          canSort ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        {typeof header.column.columnDef.header === "string"
                          ? header.column.columnDef.header
                          : header.column.id}

                        {isSorted === "asc" && (
                          <span aria-label="Sorted ascending">↑</span>
                        )}

                        {isSorted === "desc" && (
                          <span aria-label="Sorted descending">↓</span>
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[#F0E8F0] bg-white">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-[#FCFAFC]"
                >
                  {row.getAllCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-5 py-4 align-middle text-[#554655]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-[#8B7A8B]"
                >
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-[#F0E8F0] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#8B7A8B]">
          Showing{" "}
          {table.getRowModel().rows.length > 0
            ? pagination.pageIndex * pagination.pageSize + 1
            : 0}
          {" "}to{" "}
          {pagination.pageIndex * pagination.pageSize +
            table.getRowModel().rows.length}
          {" "}of {logs.length} entries
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-[#E8DDE8] px-3 py-2 text-sm text-[#665466] transition hover:bg-[#F8F4F8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-2 text-sm text-[#665466]">
            Page {pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-[#E8DDE8] px-3 py-2 text-sm text-[#665466] transition hover:bg-[#F8F4F8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditLogTable;
