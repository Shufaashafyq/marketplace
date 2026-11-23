import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInventory, type InventoryResponse } from "../../api/inventory.api";
import { AdminDashboardSkeleton } from "../../components/admin/AdminSkeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [inventory, setInventory] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInventory() {
      try {
        const data = await getInventory();

        if (isMounted) {
          setInventory(data);
        }
      } catch (error) {
        console.error("Failed to load inventory overview:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInventory();

    return () => {
      isMounted = false;
    };
  }, []);

  const overview = useMemo(() => {
    if (!inventory) {
      return {
        totalUnits: 0,
        totalProducts: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
      };
    }

    return {
      totalUnits: inventory.summary.totalUnits,
      totalProducts: inventory.products.length,
      inStock: inventory.summary.inStock,
      lowStock: inventory.summary.lowStock,
      outOfStock: inventory.summary.outOfStock,
    };
  }, [inventory]);

  const stockData = [
    {
      name: "In stock",
      value: overview.inStock,
      color: "#3cb371",
    },
    {
      name: "Low stock",
      value: overview.lowStock,
      color: "#FFBD70",
    },
    {
      name: "Out of stock",
      value: overview.outOfStock,
      color: "#A34848",
    },
  ];

  function getPercentage(value: number) {
    if (overview.totalProducts === 0) return 0;

    return Math.round((value / overview.totalProducts) * 100);
  }

  if (authLoading) return <AdminDashboardSkeleton />;

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/products" replace />;
  }

  if (loading) return <AdminDashboardSkeleton />;

  return (
    <main className="min-h-screen bg-[#F8F8F7] p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard heading */}
        <header className="flex flex-col gap-3 border-b border-[#E8DCEB] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              className="text-4xl leading-none text-[#560319] sm:text-6xl md:text-7xl"
              style={{ fontFamily: "'Estonia', cursive" }}
            >
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#946D6D]">
              Welcome back, {user.name}.
            </p>
          </div>
        </header>

        {/* Stock health overview */}
        <section className="mt-3 rounded-[28px] border border-[#E8DCEB] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 border-b border-[#E8DCEB] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A290B7]">
                Overview
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#560319]">
                Stock health
              </h2>
            </div>

            <div className="text-sm text-[#8F8585]">
              {overview.totalProducts} products tracked
            </div>
          </div>

          <div className="mt-6 grid items-center gap-6 md:grid-cols-2">
            {/* Donut chart */}
            <div className="relative h-70 w-full rounded-2xl bg-[#FCF9FC]">
              {overview.totalProducts > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={105}
                        paddingAngle={4}
                        stroke="none"
                        isAnimationActive={false}
                      >
                        {stockData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                            style={{
                              filter: `drop-shadow(0 0 3px ${entry.color}90)`,
                            }}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [`${value} products`, name]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #E8DCEB",
                          boxShadow: "0 4px 15px rgba(86,3,25,0.08)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Chart center text */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-[#560319]">
                      {overview.totalProducts}
                    </p>

                    <p className="text-xs text-[#8F8585]">Total products</p>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border-18 border-[#F3EAF5]">
                    <span className="text-sm text-[#8F8585]">No data</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chart legend n statistics */}
            <div className="space-y-5">
              <div>
                <p className="mb-4 text-sm font-semibold text-[#560319]">
                  Stock distribution
                </p>

                <div className="space-y-4">
                  {stockData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {/* Luminous legend dot */}
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: item.color,
                            boxShadow: `0 0 5px ${item.color}, 0 0 11px ${item.color}80`,
                          }}
                        />

                        <span className="text-sm text-[#8F8585]">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-[#560319]">
                          {item.value}
                        </span>

                        <span className="w-12 text-right text-xs text-[#A290B7]">
                          {getPercentage(item.value)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick statistics */}
              <div className="grid grid-cols-2 gap-3 border-t border-[#E8DCEB] pt-5">
                <div className="rounded-xl bg-[#F9F4F7] p-3">
                  <p className="text-xs text-[#8F8585]">Healthy stock</p>

                  <p className="mt-2 text-2xl font-semibold text-[#560319]">
                    {getPercentage(overview.inStock)}%
                  </p>
                </div>

                <div className="rounded-xl bg-[#F9F4F7] p-3">
                  <p className="text-xs text-[#8F8585]">Need attention</p>

                  <p className="mt-2 text-2xl font-semibold text-[#560319]">
                    {overview.lowStock + overview.outOfStock}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboardPage;