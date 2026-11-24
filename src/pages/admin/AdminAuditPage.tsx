import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { getAuditLogs, type AuditLog } from "../../api/audit.api";
import { getAuditLogColumns } from "../../components/admin/tables/AuditLogTableColumns";

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);

  async function fetchLogs() {
    try {
      setLoading(true);
      setError("");

      const data = await getAuditLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      setError("Unable to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return logs;

    return logs.filter((log) =>
      [log.action, log.adminName, log.entityName, log.entityType].some(
        (value) => value.toLowerCase().includes(query),
      ),
    );
  }, [logs, search]);

  useEffect(() => {
    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
  }, [search]);

  const columns = getAuditLogColumns();

  const table = useTable({
    key: "audit-log-table",
    features,
    data: filteredLogs,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    autoResetPageIndex: false,
  });

  const pageIndex = pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <main className="min-h-screen bg-[#F8F8F7] px-5 pb-12 pt-4 sm:pt-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Page Heading */}
        <div>
          <h1
            className="text-7xl font-semibold text-[#560319]"
            style={{ fontFamily: "'Estonia', cursive" }}
          >
            Audit Logs
          </h1>

          <p className="mt-1 text-sm text-[#8F8585]">
            Keep track of administrative activities across your marketplace.
          </p>
        </div>

        {/* Activity Summary */}
        <div className="flex w-fit items-center gap-8 rounded-2xl border border-[#E8DCEB] bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A290B7]">
              Total recorded activities
            </p>

            <p className="mt-1.5 text-3xl font-semibold text-[#560319]">
              {logs.length}
            </p>

            <p className="mt-1 text-xs text-[#8F8585]">
              Administrative actions recorded in your marketplace
            </p>
          </div>

          <button
            type="button"
            onClick={fetchLogs}
            disabled={loading}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-[#E8DCEB] bg-white px-4 py-2.5 text-sm font-medium text-[#560319] transition-colors hover:bg-[#F3EAF5] disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A290B7]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search activity, admin or product..."
            className="h-11 w-full rounded-lg border border-[#E8DCEB] bg-white pl-9 pr-4 text-sm text-[#560319] outline-none transition-colors placeholder:text-[#A290B7] focus:border-[#A290B7]"
          />
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E8DCEB] bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-2 text-sm text-[#A290B7]">
                <Activity size={16} />
                Loading audit logs...
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchLogs}
                className="rounded-lg border border-[#E8DCEB] px-4 py-2 text-sm text-[#560319] hover:bg-[#F3EAF5]"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-200 text-sm">
                <thead className="border-b border-[#E8DCEB] bg-[#FDFBFC]">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const isSorted = header.column.getIsSorted();
                        const canSort = header.column.getCanSort();

                        return (
                          <th key={header.id} className="px-5 py-3.5 text-left">
                            {header.isPlaceholder ? null : (
                              <button
                                type="button"
                                disabled={!canSort}
                                onClick={header.column.getToggleSortingHandler()}
                                className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A290B7] ${
                                  canSort
                                    ? "hover:text-[#560319]"
                                    : "cursor-default"
                                }`}
                              >
                                {typeof header.column.columnDef.header ===
                                "string"
                                  ? header.column.columnDef.header
                                  : header.column.id}

                                {canSort &&
                                  (isSorted === "asc" ? (
                                    <ArrowUp size={13} />
                                  ) : isSorted === "desc" ? (
                                    <ArrowDown size={13} />
                                  ) : (
                                    <ChevronsUpDown
                                      size={13}
                                      className="opacity-50"
                                    />
                                  ))}
                              </button>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>

                <tbody className="divide-y divide-[#E8DCEB]">
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-[#FDF6F8]"
                      >
                        {row.getAllCells().map((cell) => (
                          <td key={cell.id} className="px-5 py-4">
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
                        className="px-6 py-12 text-center"
                      >
                        <Activity
                          className="mx-auto text-[#A290B7]"
                          size={28}
                        />

                        <p className="mt-3 text-sm font-medium text-[#560319]">
                          No activities found
                        </p>

                        <p className="mt-1 text-xs text-[#8F8585]">
                          {search
                            ? "Try searching with a different keyword."
                            : "Administrative activities will appear here."}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && filteredLogs.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#8F8585]">
              Page {pageIndex + 1} of {Math.max(1, pageCount)}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-lg border border-[#E8DCEB] bg-white px-3 py-2 text-sm text-[#8F8585] transition-colors hover:bg-[#F3EAF5] hover:text-[#560319] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-lg border border-[#E8DCEB] bg-white px-3 py-2 text-sm text-[#8F8585] transition-colors hover:bg-[#F3EAF5] hover:text-[#560319] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminAuditPage;
