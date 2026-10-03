import { motion } from "motion/react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../api/product.api";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const { isProductLiked, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();

  const isFavorite = isProductLiked(product.id);

  const primaryImage =
    product.images.find((image) => image.isPrimary) ??
    product.images[0];

  function openProduct() {
    navigate(`/products/${product.id}`);
  }

  async function handleWishlistToggle(
    event: React.MouseEvent
  ) {
    event.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await toggleWishlist(product);
      if (isFavorite) {
      toast.success(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} added to wishlist`);
    }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      toast.error("Failed to update wishlist. Please try again.");
    }
  }

  async function handleAddToCart(
    event: React.MouseEvent
  ) {
    event.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addItem(product.id, 1);
      toast.success(`${product.name} added to cart successfully`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  }

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="
        group relative overflow-hidden rounded-3xl
        border border-white/70
        bg-white/45
        shadow-[0_8px_30px_rgba(86,3,25,0.06)]
        backdrop-blur-2xl
        transition-shadow duration-500
        hover:bg-white/60
        hover:shadow-[0_18px_45px_rgba(86,3,25,0.12)]
      "
    >
      {/* Glass highlight */}
      <div
        className="
          pointer-events-none absolute inset-0 z-0
          bg-linear-to-br
          from-white/75
          via-white/10
          to-[#E8DCEB]/25
          opacity-80
        "
      />

      {/* Subtle top glow */}
      <div
        className="
          pointer-events-none absolute
          -right-12 -top-12
          h-32 w-32
          rounded-full
          bg-[#E8DCEB]/30
          blur-3xl
        "
      />

      {/* Card content */}
      <div className="relative z-10">
        {/* Product Image */}
        <div
          className="
            relative m-2
            cursor-pointer
            overflow-hidden
            rounded-[18px]
            bg-[#F3EDF5]
          "
          onClick={openProduct}
        >
          <div className="aspect-square">
            {primaryImage ? (
              <motion.img
                src={primaryImage.url}
                alt={product.name}
                whileHover={{
                  scale: 1.045,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-xs text-[#A290B7]">
                  No image
                </span>
              </div>
            )}
          </div>

          {/* Image glass overlay */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-linear-to-t
              from-[#560319]/10
              via-transparent
              to-white/10
            "
          />

          {/* Wishlist */}
          <motion.button
            type="button"
            aria-label={
              isFavorite
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={isFavorite}
            onClick={handleWishlistToggle}
            whileHover={{
              scale: 1.12,
            }}
            whileTap={{
              scale: 0.88,
            }}
            className="
              absolute right-3 top-3
              flex h-9 w-9
              items-center justify-center
              rounded-full
              border border-white/60
              bg-white/55
              text-[#560319]
              shadow-sm
              backdrop-blur-md
            "
          >
            <motion.div
              animate={
                isFavorite
                  ? {
                      scale: [1, 1.3, 1],
                    }
                  : {
                      scale: 1,
                    }
              }
              transition={{
                duration: 0.3,
              }}
            >
              <Heart
                size={17}
                strokeWidth={1.8}
                className={
                  isFavorite
                    ? "text-red-600"
                    : "text-[#560319]"
                }
                fill={
                  isFavorite
                    ? "currentColor"
                    : "none"
                }
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="px-4 pb-4 pt-2">
          {/* Category */}
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#A290B7]
            "
          >
            {product.category}
          </p>

          {/* Product Name */}
          <h2
            className="
              mt-1.5
              cursor-pointer
              text-4xl
              leading-snug
              text-[#560319]
              transition-opacity
              hover:opacity-70
            "
            style={{
              fontFamily: "'Estonia', cursive",
            }}
            onClick={openProduct}
          >
            {product.name}
          </h2>

          {/* Price n Cart */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-base font-semibold text-[#560319]">
              ${product.price}
            </p>

            <div className="group/cart relative">
              <motion.button
                type="button"
                aria-label={`Add ${product.name} to cart`}
                onClick={handleAddToCart}
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  text-[#560319]
                  transition-colors
                  hover:bg-[#F3EAF5]
                  hover:text-[#3D0112]
                "
              >
                <ShoppingCart
                  size={18}
                  strokeWidth={1.8}
                />
              </motion.button>

              {/* Tooltip */}
              <span
                className="
                  pointer-events-none
                  absolute bottom-full right-0 mb-2
                  whitespace-nowrap
                  rounded-md
                  bg-[#FDF4D2]
                  px-2.5 py-1.5
                  text-[10px]
                  font-medium
                  text-[#560319]
                  opacity-0
                  shadow-sm
                  transition-opacity duration-200
                  group-hover/cart:opacity-100
                "
              >
                Add to cart
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;