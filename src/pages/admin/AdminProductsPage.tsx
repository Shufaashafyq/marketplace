import { useEffect, useState } from "react";
import ProductTable from "../../components/admin/ProductTable";
import { getProducts, type Product } from "../../api/product.api";
import AddProductDialog from "../../components/admin/AddProductBtn";

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="px-6 pb-8 pt-4 md:px-8 md:pb-8 md:pt-5">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-6xl text-[#560319]"
            style={{ fontFamily: "'Estonia', cursive" }}
          >
            Products
          </h2>

          <p className="mt-1 text-sm text-[#8F8585]">
            Manage your products and inventory.
          </p>
        </div>

        <AddProductDialog onProductCreated={loadProducts} />
      </div>

      <ProductTable
        products={products}
        loading={loading}
        onProductsChanged={loadProducts}
      />
    </div>
  );
}

export default AdminProductsPage;