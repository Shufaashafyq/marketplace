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
import { formatMVRSymbol, formatMVRAmount } from "../lib/formatCurrency";
import DOMPurify from "dompurify";

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
          <p className="text-sm text-[#A290B7]">Loading product...</p>
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
      product.images.find((image) => image.isPrimary) ?? product.images[0];

    return (
      <main className="relative min-h-screen bg-[#F8F8F7] px-4 py-6 sm:px-8 lg:py-12">
        <img
          src="/images/illustrations/florals.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-24 z-0 w-28 opacity-80 sm:w-32 lg:w-44"
        />

        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => navigate("/products#our-gifts")}
            className="mb-6 flex items-center gap-2 text-sm text-[#946D6D] transition-colors hover:text-[#560319] sm:mb-8"
          >
            <ArrowLeft size={17} strokeWidth={1.8} />
            Back to gifts
          </button>

          <div className="grid items-start gap-6 md:grid-cols-2 lg:gap-16">
            {/* Product Image */}
            <div className="relative mx-auto aspect-square w-full max-w-130 overflow-hidden bg-[#F3EDF5]">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm text-[#A290B7]">No image</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex w-full flex-col md:min-h-full">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A290B7]">
                {product.category}
              </p>

              <h1
                className="mt-2 text-3xl leading-tight text-[#560319] sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "'Estonia', cursive" }}
              >
                {product.name}
              </h1>

              <p className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                <span className="text-[15px] italic font-medium text-emerald-700/65 sm:text-[18px]">
                  {formatMVRSymbol(product.price)}
                </span>

                <span className="text-[14px] font-semibold text-[#560319] tabular-nums sm:text-[20px]">
                  {formatMVRAmount(product.price)}
                </span>
              </p>

              {/* Description */}
              <div className="mt-12">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#560319]">
                  Description
                </h2>

                <div
                  className="
                  text-sm leading-7 text-[#6F6666]
                  [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-base
                  [&_h2]:font-semibold [&_h2]:text-[#560319]
                  [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-sm
                  [&_h3]:font-semibold [&_h3]:text-[#560319]
                  [&_p]:mb-3
                  [&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc
                  [&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal
                  [&_li]:pl-1
                  [&_strong]:font-semibold [&_strong]:text-[#560319]
                 "
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description),
                  }}
                />
              </div>

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-start">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={
                    isFavorite ? "Remove from wishlist" : "Add to wishlist"
                  }
                  aria-pressed={isFavorite}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E8DCEB] text-[#560319] transition-all duration-200 hover:bg-[#F3EDF5]"
                >
                  <Heart
                    size={19}
                    strokeWidth={1.8}
                    fill={isFavorite ? "#560319" : "none"}
                  />
                </button>

                <div className="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#560319] px-8 text-sm font-medium text-[#FDF4D2] transition-all duration-200 hover:bg-[#6D0825] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart size={18} strokeWidth={1.8} />
                    {product.stock > 0 ? "Add to cart" : "Out of stock"}
                  </button>

                  <p className="text-xs text-[#946D6D]">
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <DashboardHeader onFilterClick={() => setFilterOpen(true)} />
      <CategorySidebar
        open={filterOpen}
        category="all"
        categories={[...CATEGORIES]}
        onCategoryChange={(cat) => navigate(`/products?category=${cat}`)}
        onClose={() => setFilterOpen(false)}
      />

      {renderContent()}
    </>
  );
}

export default ProductDetailsPage;
