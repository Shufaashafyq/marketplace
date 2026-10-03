import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import DashboardHeader from "../components/layout/DashboardHeader";
import ProductGrid from "../components/products/ProductGrid";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

function WishlistPage() {
  const { wishlistProducts, loading } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFilterClick = () => {
    navigate("/products");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardHeader onFilterClick={handleFilterClick} />

      <main className="min-h-screen bg-linear-to-br from-[#F9F6FB] via-transparent to-[#F3EDF5]">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <button
            type="button"
            onClick={() => navigate("/products#our-gifts")}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#560319] transition-colors hover:text-[#946D6D]"
          >
            <ArrowLeft size={16} />
            Back to gifts
          </button>

          {/* Header */}
          <div className="mb-12 flex items-center gap-3">
            <Heart
              size={32}
              fill="currentColor"
              className="text-red-600"
            />

            <h1 className="text-4xl font-bold text-[#560319]">
              My Wishlist
            </h1>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-[#946D6D]">
                Loading your wishlist...
              </p>
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Heart
                size={64}
                className="mb-4 text-[#A290B7]"
                strokeWidth={1.5}
              />

              <p className="text-lg text-[#946D6D]">
                Your wishlist is empty
              </p>

              <p className="text-sm text-[#A290B7]">
                Start adding products to your wishlist!
              </p>

              <button
                type="button"
                onClick={() => navigate("/products#our-gifts")}
                className="mt-6 rounded-lg bg-[#560319] px-6 py-2 font-medium text-[#FDF4D2] transition-opacity hover:opacity-80"
              >
                Back to products
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={wishlistProducts} />
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default WishlistPage;