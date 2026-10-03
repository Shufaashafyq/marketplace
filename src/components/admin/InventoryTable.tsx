import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Package,
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

import type { Product } from "../../api/product.api";
import { getInventoryTableColumns } from "./InventoryTableColumns";

type InventoryTableProps = {
  products: Product[];
  loading: boolean;
  onUpdateStock: (product: Product) => void;
};

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,

  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

function InventoryTable({
  products,
  loading,
  onUpdateStock,
}: InventoryTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = getInventoryTableColumns(onUpdateStock);

  const table = useTable({
    key: "inventory-table",
    features,
    data: products,
    columns,

    state: {
      pagination,
    },

    onPaginationChange: setPagination,

    autoResetPageIndex: false,
  });

  const pageIndex = pagination.pageIndex;
  const pageCount = table.getPageCount();

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#E8DCEB] bg-white shadow-sm">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-sm text-[#A290B7]">
            <Package className="h-4 w-4" />
            Loading inventory...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E8DCEB] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-sm">
            <thead className="border-b border-[#E8DCEB] bg-[#FDFBFC]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isActions =
                      header.column.id === "actions";

                    const isSorted =
                      header.column.getIsSorted();

                    const canSort =
                      header.column.getCanSort();

                    return (
                      <th
                        key={header.id}
                        className={`px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A290B7] ${
                          isActions ? "text-right" : ""
                        }`}
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            disabled={!canSort}
                            onClick={
                              header.column.getToggleSortingHandler()
                            }
                            className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A290B7] transition-colors ${
                              canSort
                                ? "hover:text-[#560319]"
                                : "cursor-default"
                            } ${
                              isActions
                                ? "ml-auto"
                                : ""
                            }`}
                          >
                            {typeof header.column.columnDef
                              .header === "string"
                              ? header.column.columnDef.header
                              : header.column.id}

                            {canSort &&
                              (isSorted === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : isSorted === "desc" ? (
                                <ArrowDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
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
                      <td
                        key={cell.id}
                        className="px-5 py-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
                    <Package
                      className="mx-auto text-[#A290B7]"
                      size={28}
                    />

                    <p className="mt-3 text-sm font-medium text-[#560319]">
                      All products are sufficiently stocked.
                    </p>

                    <p className="mt-1 text-xs text-[#8F8585]">
                      There are currently no products requiring
                      attention.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-[#8F8585]">
          Page {pageIndex + 1} of{" "}
          {Math.max(1, pageCount)}
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
    </div>
  );
}

export default InventoryTable;