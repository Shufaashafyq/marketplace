import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, type Product } from "../api/product.api";
import DashboardHeader from "../components/layout/DashboardHeader";
import CategorySidebar from "../components/products/CategorySidebar";
import { CATEGORIES } from "../lib/categories";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const { isProductLiked, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();

  const isFavorite = product ? isProductLiked(product.id) : false;

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleToggleWishlist() {
    if (!product) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  }

  async function handleAddToCart() {
    if (!product) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addItem(product.id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  }

  function renderContent() {
    if (loading) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#F8F8F7]">
          <p className="text-sm text-[#A290B7]">
            Loading product...
          </p>
        </main>
      );
    }

    if (error || !product) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8F8F7] px-5">
          <p className="text-sm text-[#946D6D]">
            {error || "Product not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-4 text-sm font-medium text-[#560319] underline underline-offset-4"
          >
            Back to gifts
          </button>
        </main>
      );
    }

    const primaryImage =
      product.images.find((image) => image.isPrimary) ??
      product.images[0];

    return (
      <main className="min-h-screen bg-[#F8F8F7] px-5 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mb-8 flex items-center gap-2 text-sm text-[#946D6D] transition-colors hover:text-[#560319]"
          >
            <ArrowLeft size={17} strokeWidth={1.8} />
            Back to gifts
          </button>

          <div className="grid gap-10 md:grid-cols-2 md:items-center lg:gap-16">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-2xl bg-[#F3EDF5]">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={product.name}
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center">
                  <span className="text-sm text-[#A290B7]">
                    No image
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A290B7]">
                {product.category}
              </p>

              <h1
                className="mt-2 text-5xl leading-none text-[#560319] sm:text-6xl"
                style={{ fontFamily: "'Estonia', cursive" }}
              >
                {product.name}
              </h1>

              <p className="mt-5 text-2xl font-semibold text-[#560319]">
                ${product.price}
              </p>

              <div className="my-7 h-px bg-[#E8DCEB]" />

              <p className="text-sm leading-7 text-[#6F6666]">
                {product.description}
              </p>

              {/* Stock */}
              <p className="mt-5 text-xs text-[#946D6D]">
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </p>

              {/* Actions */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={
                    isFavorite
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  aria-pressed={isFavorite}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8DCEB] text-[#560319] transition-all duration-200 hover:bg-[#F3EDF5]"
                >
                  <Heart
                    size={19}
                    strokeWidth={1.8}
                    fill={isFavorite ? "#560319" : "none"}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#560319] px-6 text-sm font-medium text-[#FDF4D2] transition-all duration-200 hover:bg-[#6D0825] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingCart
                    size={18}
                    strokeWidth={1.8}
                  />
                  {product.stock > 0
                    ? "Add to cart"
                    : "Out of stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <DashboardHeader
        onFilterClick={() => setFilterOpen(true)}
      />
      <CategorySidebar
        open={filterOpen}
        category="all"
        categories={[...CATEGORIES]}
        onCategoryChange={(cat) =>
          navigate(`/products?category=${cat}`)
        }
        onClose={() => setFilterOpen(false)}
      />

      {renderContent()}
    </>
  );
}

export default ProductDetailsPage;

