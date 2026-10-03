import { Heart, ShoppingCart, User, Store, SlidersHorizontal, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileDialog from "../profile/ProfileDialog";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

type DashboardHeaderProps = {
  onFilterClick: () => void;
};

function NavTooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#FDF4D2] px-2.5 py-1.5 text-xs font-medium text-[#946D6D] opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
      {label}
    </span>
  );
}

function DashboardHeader({
  onFilterClick,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-[#560319]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <div className="group relative">
            <button
              type="button"
              onClick={onFilterClick}
              aria-label="Filter products"
              className="flex items-center justify-center text-[#FDF4D2] transition-opacity hover:opacity-70"
            >
              <SlidersHorizontal
                size={21}
                strokeWidth={1.8}
              />
            </button>

            <NavTooltip label="Categories" />
          </div>

          <h1
            className="text-3xl font-bold text-[#FDF4D2] sm:text-4xl"
            style={{
              fontFamily: "'Estonia', cursive",
            }}
          >
            The Art of Gift Giving
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {/* Products */}
          <div className="group relative">
            <button
              type="button"
              aria-label="Products"
              onClick={() => navigate("/products#our-gifts")}
              className="flex items-center justify-center text-[#FDF4D2] transition-opacity hover:opacity-70"
            >
              <Store size={21} strokeWidth={1.8} />
            </button>

            <NavTooltip label="Products" />
          </div>

          {/* Wishlist */}
          <div className="group relative">
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => navigate("/wishlist")}
              className="relative flex items-center justify-center text-[#FDF4D2] transition-opacity hover:opacity-70"
            >
              <Heart size={21} strokeWidth={1.8} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FDF4D2] px-1 text-[9px] font-semibold text-[#946D6D]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <NavTooltip label="Wishlist" />
          </div>

          {/* Cart */}
          <div className="group relative">
            <button
              type="button"
              aria-label="Shopping cart"
              onClick={() => navigate("/cart")}
              className="relative flex items-center justify-center text-[#FDF4D2] transition-opacity hover:opacity-70"
            >
              <ShoppingCart
                size={21}
                strokeWidth={1.8}
              />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FDF4D2] px-1 text-[9px] font-semibold text-[#946D6D]">
                  {cartCount}
                </span>
              )}
            </button>

            <NavTooltip label="Cart" />
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              aria-label="User profile"
              onClick={() => setProfileOpen(true)}
              className="flex items-center justify-center text-[#FDF4D2] transition-opacity hover:opacity-70"
            >
              <User size={21} strokeWidth={1.8} />
            </button>

            <NavTooltip label="Profile" />

            <ProfileDialog
              open={profileOpen}
              onOpenChange={(next) => setProfileOpen(next)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;

