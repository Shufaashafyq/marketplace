import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
} from "lucide-react";
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { Product } from "../../api/product.api";
import { CATEGORIES } from "../../lib/categories";
import { getProductTableColumns } from "./ProductTableColumns";

type ProductTableProps = {
  products: Product[];
  loading: boolean;
  onProductsChanged: () => void;
};

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,

  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

function ProductTable({
  products,
  loading,
  onProductsChanged,
}: ProductTableProps) {
  const productTableColumns = getProductTableColumns(onProductsChanged);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const filteredProducts = products.filter((product) => {
    const search = globalFilter.toLowerCase().trim();

    const matchesSearch =
      search === "" ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.brand?.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === "ALL" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const table = useTable({
    key: "products-table",
    features,
    data: filteredProducts,
    columns: productTableColumns,
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
  });

  const categories = Array.from(
    new Set([...CATEGORIES, ...products.map((product) => product.category)])
  );

  const resetPagination = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const pageIndex = pagination.pageIndex;
  const pageCount = table.getPageCount();

  if (loading) {
    return (
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-slate-500">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Search n Filter */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={globalFilter}
          onChange={(event) => {
            setGlobalFilter(event.target.value);
            resetPagination();
          }}
          placeholder="Search products..."
          className="w-72 rounded-lg border border-[#E8DCEB] bg-[#FDF6F8] px-4 py-2.5 text-sm text-[#560319] outline-none transition placeholder:text-[#B4A5A5] focus:border-[#C8B3CE] focus:ring-2 focus:ring-[#F3EAF5]"
        />

        <select
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(event.target.value);
            resetPagination();
          }}
          className="rounded-lg border border-[#E8DCEB] bg-[#FDF6F8] px-4 py-2.5 text-sm text-[#560319] outline-none focus:border-[#C8B3CE] focus:ring-2 focus:ring-[#F3EAF5]"
        >
          <option value="ALL">All categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-sm">
            <thead className="border-b border-[#E8DCEB] bg-[#FDFBFC]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isActions = header.id === "actions";
                    const isSorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={`px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A290B7] ${
                          isActions ? "text-right" : ""
                        }`}
                      >
                        {header.isPlaceholder ? null : isActions ? (
                          "Actions"
                        ) : (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A290B7] transition-colors hover:text-[#560319]"
                          >
                            {typeof header.column.columnDef.header === "string"
                              ? header.column.columnDef.header
                              : header.column.id}

                            {isSorted === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5" />
                            ) : isSorted === "desc" ? (
                              <ArrowDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
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
                      <td key={cell.id} className="px-4 py-4">
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
                    colSpan={productTableColumns.length}
                    className="px-4 py-10 text-center"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      No products found.
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Try changing your search or category filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Page {pageIndex + 1} of {Math.max(1, pageCount)}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductTable;
