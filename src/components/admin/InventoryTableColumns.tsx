import { Package } from "lucide-react";
import type { Product } from "../../api/product.api";

function getStockStatus(stock: number) {
  if (stock === 0) {
    return {
      label: "Out of stock",
      dot: "bg-red-400",
      pill: "bg-[#FBE8EC] text-[#8B1A1A]",
    };
  }

  if (stock <= 5) {
    return {
      label: "Low stock",
      dot: "bg-amber-400",
      pill: "bg-[#FDF4D2] text-[#7A4A00]",
    };
  }

  return {
    label: "In stock",
    dot: "bg-emerald-400",
    pill: "bg-[#EAF5ED] text-[#1E5C35]",
  };
}

export function getInventoryTableColumns(
  onUpdateStock: (product: Product) => void
) {
  return [
    {
      accessorKey: "name",
      header: "Product",

      cell: ({ row }: any) => {
        const product = row.original as Product;

        const primaryImage =
          product.images.find(
            (image) => image.isPrimary
          ) ?? product.images[0];

        return (
          <div className="flex min-w-0 items-center gap-3">
            {/* Product Image */}
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F3EDF5]">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package
                    size={16}
                    className="text-[#A290B7]"
                  />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#560319]">
                {product.name}
              </p>

              <p className="mt-0.5 text-xs text-[#A290B7]">
                {product.category}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "stock",
      header: "Current Stock",

      cell: (info: any) => (
        <span className="text-sm text-[#8F8585]">
          {info.getValue()}
        </span>
      ),
    },

    {
      id: "status",
      header: "Status",
      enableSorting: false,

      accessorFn: (product: Product) =>
        product.stock > 0
          ? product.stock <= 5
            ? "Low stock"
            : "In stock"
          : "Out of stock",

      cell: ({ row }: any) => {
        const product = row.original as Product;
        const status = getStockStatus(product.stock);

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.06em] ${status.pill}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
            />

            {status.label}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: "Update",
      enableSorting: false,

      cell: ({ row }: any) => {
        const product = row.original as Product;

        return (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onUpdateStock(product)}
              className="rounded-lg border border-[#E8DCEB] bg-white px-3 py-2 text-xs font-medium text-[#560319] transition-colors hover:bg-[#F3EAF5]"
            >
              Update Stock
            </button>
          </div>
        );
      },
    },
  ];
}