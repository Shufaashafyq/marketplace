import { useEffect, useState } from "react";
import { Package, TriangleAlert, XCircle, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import {
  getInventory,
  updateInventoryStock,
  type InventoryResponse,
} from "../../api/inventory.api";
import type { Product } from "../../api/product.api";
import InventoryTable from "../../components/admin/tables/InventoryTable";
import UpdateStockDialog from "../../components/admin/dialogs/UpdateStockDialog";
import { AdminTableSkeleton } from "../../components/admin/AdminSkeleton";

type SummaryCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconContainerClassName: string;
  iconClassName: string;
  iconShadow: string;
  cardShadow: string;
};

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconContainerClassName,
  iconClassName,
  iconShadow,
  cardShadow,
}: SummaryCardProps) {
  return (
    <div
      className="rounded-2xl border border-[#E8DCEB] bg-white p-5 shadow-sm"
      style={{ boxShadow: `0 10px 24px ${cardShadow}, 0 0 18px ${cardShadow}` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#A290B7]">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold text-[#560319]">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconContainerClassName}`}
        >
          <Icon
            size={18}
            className={iconClassName}
            style={{ filter: `drop-shadow(0 0 5px ${iconShadow})` }}
          />
        </div>
      </div>
    </div>
  );
}

function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [updating, setUpdating] = useState(false);

  const summaryCards = [
    {
      label: "In Stock",
      value: inventory?.summary.inStock ?? 0,
      icon: Package,
      iconContainerClassName: "bg-[#EAF6EE]",
      iconClassName: "text-[#3B7D5A]",
      iconShadow: "#34D399B3",
      cardShadow: "rgba(52, 211, 153, 0.16)",
    },
    {
      label: "Low Stock",
      value: inventory?.summary.lowStock ?? 0,
      icon: TriangleAlert,
      iconContainerClassName: "bg-[#FDF4D2]",
      iconClassName: "text-[#946D6D]",
      iconShadow: "#FBBF24B3",
      cardShadow: "rgba(251, 191, 36, 0.18)",
    },
    {
      label: "Out of Stock",
      value: inventory?.summary.outOfStock ?? 0,
      icon: XCircle,
      iconContainerClassName: "bg-[#FBE8EC]",
      iconClassName: "text-[#A34848]",
      iconShadow: "#F87171B3",
      cardShadow: "rgba(248, 113, 113, 0.16)",
    },
  ];

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
        stock,
      );

      setInventory((current) => {
        if (!current) {
          return current;
        }

        const products = current.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product,
        );

        const totalUnits = products.reduce(
          (total, product) => total + product.stock,
          0,
        );

        const lowStock = products.filter(
          (product) => product.stock > 0 && product.stock <= 5,
        ).length;

        const outOfStock = products.filter(
          (product) => product.stock === 0,
        ).length;

        const inStock = products.filter((product) => product.stock > 5).length;

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

  //derive products stock <= 5 from all products, put in asc
  const productsNeedingAttention = inventory
    ? inventory.products
        .filter((product) => product.stock <= 5)
        .sort((a, b) => a.stock - b.stock)
    : [];

  // %= no. of products in stock category / total products x100

  if (loading) {
    return (
      <div className="min-h-full px-4 pb-8 pt-4 sm:px-6 md:px-8 md:pb-8 md:pt-2">
        {/* Header */}
        <div>
          <h1
            className="text-4xl leading-none text-[#560319] sm:text-6xl"
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
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
              iconContainerClassName={card.iconContainerClassName}
              iconClassName={card.iconClassName}
              iconShadow={card.iconShadow}
              cardShadow={card.cardShadow}
            />
          ))}
        </div>

        {/* Stock Requiring Attention */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-[#560319]">
              Stock requiring attention
            </h2>

            <div className="mt-3 h-px bg-[#E8DCEB]" />
          </div>

          <AdminTableSkeleton rows={5} />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 pb-8 pt-4 sm:px-6 md:px-8 md:pb-8 md:pt-2">
      {/* Header */}
      <div>
        <h1
          className="text-4xl leading-none text-[#560319] sm:text-6xl"
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
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            iconContainerClassName={card.iconContainerClassName}
            iconClassName={card.iconClassName}
            iconShadow={card.iconShadow}
            cardShadow={card.cardShadow}
          />
        ))}
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
