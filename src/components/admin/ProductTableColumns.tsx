import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../../api/product.api";
import ProductTableActions from "./ProductTableActions";

export function getProductTableColumns(
  onProductsChanged: () => void
): ColumnDef<any, Product>[] {
  return [
  {
    accessorKey: "name",
    header: "Product",

    cell: ({ row }) => {
      const product = row.original;

      const primaryImage =
        product.images.find(
          (image) => image.isPrimary
        ) ?? product.images[0];

      return (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F3EDF5]">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-[#A290B7]">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#560319]">
              {product.name}
            </p>

            {product.brand && (
              <p className="mt-0.5 text-xs text-[#A290B7]">
                {product.brand}
              </p>
            )}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "category",
    header: "Category",

    cell: (info) => (
      <span className="text-sm text-[#8F8585]">
        {info.getValue<string>()}
      </span>
    ),
  },

  {
    accessorKey: "price",
    header: "Price",

    cell: (info) => (
      <span className="text-sm font-medium text-[#560319]">
        ${info.getValue<string>()}
      </span>
    ),
  },

  {
    accessorKey: "stock",
    header: "Stock",

    cell: (info) => (
      <span className="text-sm text-[#8F8585]">
        {info.getValue<number>()}
      </span>
    ),
  },

  {
    id: "status",
    header: "Status",

    accessorFn: (product) =>
      product.stock > 0
        ? "In stock"
        : "Out of stock",

    cell: ({ row }) => {
      const stock = row.original.stock;
      const isOutOfStock = stock === 0;
      const isLowStock = stock > 0 && stock <= 5;

      const config = isOutOfStock
        ? { dot: "bg-red-400", pill: "bg-[#FBE8EC] text-[#8B1A1A]", label: "Out of stock" }
        : isLowStock
        ? { dot: "bg-amber-400", pill: "bg-[#FDF4D2] text-[#7A4A00]", label: "Low stock" }
        : { dot: "bg-emerald-400", pill: "bg-[#EAF5ED] text-[#1E5C35]", label: "In stock" };

      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.06em] ${config.pill}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",

    enableSorting: false,

    cell: ({ row }) => (
      <div className="flex justify-end">
        <ProductTableActions
          product={row.original}
          onProductsChanged={onProductsChanged}
        />
      </div>
    ),
  },
];
}