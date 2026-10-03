import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Package,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getInventory,
  updateInventoryStock,
  type InventoryResponse,
} from "../../api/inventory.api";
import type { Product } from "../../api/product.api";
import InventoryTable from "../../components/admin/InventoryTable";
import UpdateStockDialog from "../../components/admin/dialogs/UpdateStockDialog";

function AdminInventoryPage() {
  const [inventory, setInventory] =
    useState<InventoryResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [updating, setUpdating] = useState(false);

  async function loadInventory() {
    try {
      setLoading(true);

      const data = await getInventory();

      setInventory(data);
    } catch (error) {
      console.error("Failed to load inventory:", error);

      toast.error("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function handleStockUpdate(stock: number) {
    if (!selectedProduct) {
      return;
    }

    try {
      setUpdating(true);

      const updatedProduct = await updateInventoryStock(
        selectedProduct.id,
        stock
      );

      setInventory((current) => {
        if (!current) {
          return current;
        }

        const products = current.products.map((product) =>
          product.id === updatedProduct.id
            ? updatedProduct
            : product
        );

        const totalUnits = products.reduce(
          (total, product) => total + product.stock,
          0
        );

        const lowStock = products.filter(
          (product) =>
            product.stock > 0 && product.stock <= 5
        ).length;

        const outOfStock = products.filter(
          (product) => product.stock === 0
        ).length;

        const inStock = products.filter(
          (product) => product.stock > 5
        ).length;

        return {
          products,
          summary: {
            totalUnits,
            lowStock,
            outOfStock,
            inStock,
          },
        };
      });

      setSelectedProduct(null);

      toast.success("Stock updated successfully.");
    } catch (error) {
      console.error("Failed to update stock:", error);

      toast.error("Failed to update stock.");
    } finally {
      setUpdating(false);
    }
  }

  const productsNeedingAttention = useMemo(() => {
    if (!inventory) {
      return [];
    }

    return inventory.products
      .filter((product) => product.stock <= 5)
      .sort((a, b) => a.stock - b.stock);
  }, [inventory]);

  const overview = useMemo(() => {
    if (!inventory) {
      return {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        total: 0,
      };
    }

    const total = inventory.products.length;

    return {
      inStock: inventory.summary.inStock,
      lowStock: inventory.summary.lowStock,
      outOfStock: inventory.summary.outOfStock,
      total,
    };
  }, [inventory]);

  function getPercentage(value: number) {
    if (overview.total === 0) {
      return 0;
    }

    return Math.round(
      (value / overview.total) * 100
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-[#A290B7]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="mmin-h-full px-6 pb-8 pt-4 md:px-8 md:pb-8 md:pt-2">
      {/* Header */}
      <div>
        <h1
          className="text-6xl leading-none text-[#560319]"
          style={{ fontFamily: "'Estonia', cursive" }}
        >
          Inventory
        </h1>

        <p className="mt-2 text-sm text-[#8F8585]">
          Monitor and manage your stock levels.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {/* Total Units */}
        <div className="rounded-2xl border border-[#E8DCEB] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#A290B7]">
                Total Units
              </p>

              <p className="mt-3 text-3xl font-semibold text-[#560319]">
                {inventory?.summary.totalUnits ?? 0}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EAF5]">
              <Package
                size={18}
                className="text-[#6F5A82]"
              />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-[#E8DCEB] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#A290B7]">
                Low Stock
              </p>

              <p className="mt-3 text-3xl font-semibold text-[#560319]">
                {inventory?.summary.lowStock ?? 0}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF4D2]">
              <TriangleAlert
                size={18}
                className="text-[#946D6D]"
              />
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="rounded-2xl border border-[#E8DCEB] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#A290B7]">
                Out of Stock
              </p>

              <p className="mt-3 text-3xl font-semibold text-[#560319]">
                {inventory?.summary.outOfStock ?? 0}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBE8EC]">
              <XCircle
                size={18}
                className="text-[#A34848]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Requiring Attention */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-[#560319]">
            Stock requiring attention
          </h2>

          <div className="mt-3 h-px bg-[#E8DCEB]" />
        </div>

        <InventoryTable
          products={productsNeedingAttention}
          loading={false}
          onUpdateStock={(product) => {
            setSelectedProduct(product);
          }}
        />
      </section>

      {/* Inventory Overview */}
      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-[#560319]">
            Inventory overview
          </h2>

          <div className="mt-3 h-px bg-[#E8DCEB]" />
        </div>

        <div className="rounded-2xl border border-[#E8DCEB] bg-white p-6 shadow-sm">
          <div className="space-y-5">
            {/* In Stock */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-[#560319]">
                  In stock
                </span>

                <span className="text-[#A290B7]">
                  {getPercentage(overview.inStock)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#F3EAF5]">
                <div
                  className="h-full rounded-full bg-[#A290B7] transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      overview.inStock
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Low Stock */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-[#560319]">
                  Low stock
                </span>

                <span className="text-[#946D6D]">
                  {getPercentage(overview.lowStock)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#FDF4D2]">
                <div
                  className="h-full rounded-full bg-[#946D6D] transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      overview.lowStock
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Out of Stock */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-[#560319]">
                  Out of stock
                </span>

                <span className="text-[#A34848]">
                  {getPercentage(overview.outOfStock)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#FBE8EC]">
                <div
                  className="h-full rounded-full bg-[#A34848] transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      overview.outOfStock
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <UpdateStockDialog
          product={selectedProduct}
          open={!!selectedProduct}
          loading={updating}
          onOpenChange={(open) => {
            if (!open && !updating) {
              setSelectedProduct(null);
            }
          }}
          onUpdate={handleStockUpdate}
        />
      )}
    </div>
  );
}

export default AdminInventoryPage;