import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { getProducts, type Product } from "../api/product.api";
import ProductGrid from "../components/products/ProductGrid";
import DashboardHeader from "../components/layout/DashboardHeader";
import WelcomeSection from "../components/products/WelcomeSection";
import ProductsHeader from "../components/products/ProductsHeader";
import CategorySidebar from "../components/products/CategorySidebar";
import { CATEGORIES } from "../lib/categories";

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all"
  );
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const hasCategoryParam = Boolean(searchParams.get("category"));
    const hasProductsHash = location.hash === "#our-gifts";

    if (hasCategoryParam || hasProductsHash) {
      const target =
        document.getElementById("our-gifts") ??
        document.getElementById("products-section");

      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, searchParams]);

  function handleCategoryChange(value: string) {
    setCategory(value);
    const target =
      document.getElementById("our-gifts") ??
      document.getElementById("products-section");

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    const matchesCategory =
      category === "all" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <DashboardHeader onFilterClick={() => setFilterOpen(true)} />

      <CategorySidebar
        open={filterOpen}
        category={category}
        categories={[...CATEGORIES]}
        onCategoryChange={handleCategoryChange}
        onClose={() => setFilterOpen(false)}
      />

      <WelcomeSection />

      <ProductsHeader
        search={search}
        category={category}
        categories={[...CATEGORIES]}
        onSearchChange={setSearch}
        onCategoryChange={handleCategoryChange}
      />

      <main id="products-section" className="min-h-screen bg-[#F8F8F7] px-5 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Loading state */}
          {loading && (
            <p className="mt-8 text-center text-sm text-[#A290B7]">
              Loading products...
            </p>
          )}

          {/* Error state */}
          {error && (
            <div className="mt-8 rounded-lg bg-[#FDF4D2] px-4 py-3 text-center">
              <p className="text-sm text-[#946D6D]">
                {error}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading &&
            !error &&
            products.length === 0 && (
              <p className="mt-8 text-center text-sm text-[#A290B7]">
                No products available yet.
              </p>
            )}

          {!loading &&
            !error &&
            products.length > 0 &&
            filteredProducts.length === 0 && (
              <p className="mt-8 text-center text-sm text-[#A290B7]">
                No products match your search or selected category.
              </p>
            )}

          {/* Products */}
          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="mt-8">
                <ProductGrid
                  products={filteredProducts}
                />
              </div>
            )}
        </div>
      </main>
    </>
  );
}

export default ProductsPage;

