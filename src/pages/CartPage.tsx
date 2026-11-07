import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import DashboardHeader from "../components/layout/DashboardHeader";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ClearCartDialog from "../components/cart/ClearCartDialog";
import { formatMVR, formatMVRSymbol, formatMVRAmount } from "../lib/formatCurrency";

function CartPage() {
  const {
    cartItems,
    loading,
    updateItem,
    removeItem,
    clear,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [clearCartOpen, setClearCartOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFilterClick = () => {
    navigate("/products");
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      parseFloat(item.product.price) * item.quantity,
    0
  );

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await removeItem(productId);
    } else {
      await updateItem(productId, newQuantity);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardHeader onFilterClick={handleFilterClick} />

      <main className="min-h-screen bg-linear-to-br from-[#F9F6FB] to-[#F3EDF5]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-12">
          <button
            type="button"
            onClick={() => navigate("/products#our-gifts")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#560319] transition-colors hover:text-[#946D6D] sm:mb-8"
          >
            <ArrowLeft size={16} />
            Back to gifts
          </button>

          {/* Header */}
          <div className="mb-8 flex items-center gap-3 sm:mb-12">
            <ShoppingCart
              size={28}
              className="text-[#560319] sm:h-8 sm:w-8"
            />

            <h1 className="text-3xl font-bold text-[#560319] sm:text-4xl">
              Shopping Cart
            </h1>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-[#946D6D]">
                Loading your cart...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingCart
                size={64}
                className="mb-4 text-[#A290B7]"
                strokeWidth={1.5}
              />

              <p className="text-lg text-[#946D6D]">
                Your cart is empty
              </p>

              <p className="text-sm text-[#A290B7]">
                Add some products to get started!
              </p>

              <button
                type="button"
                onClick={() => navigate("/products#our-gifts")}
                className="mt-6 rounded-lg bg-[#560319] px-6 py-2 font-medium text-[#FDF4D2] transition-opacity hover:opacity-80"
              >
                Browse products
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const primaryImage =
                      item.product.images.find(
                        (img) => img.isPrimary
                      ) ?? item.product.images[0];

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 rounded-xl border border-[#E8DCEB]/80 bg-white/70 p-3 backdrop-blur-xl sm:flex-row sm:p-4"
                      >
                        {/* Product Image */}
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#F3EDF5]">
                          {primaryImage ? (
                            <img
                              src={primaryImage.url}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#A290B7]">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col justify-between gap-3">
                          <div>
                            <h3 className="cursor-pointer text-base font-medium text-[#560319] transition-opacity hover:opacity-70 sm:text-lg">
                              {item.product.name}
                            </h3>

                            <p className="text-sm text-[#A290B7]">
                              {item.product.category}
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-baseline gap-1.5">
                              <Banknote
                                size={15}
                                strokeWidth={1.8}
                                className="shrink-0 translate-y-px text-emerald-700/55"
                              />
                              <span className="text-[15px] italic font-medium text-emerald-700/65">
                                {formatMVRSymbol(item.product.price)}
                              </span>
                              <span className="text-[15px] font-semibold text-[#560319] tabular-nums">
                                {formatMVRAmount(item.product.price)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3EDF5] text-[#560319] transition-all hover:bg-[#E8DCEB]"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>

                              <span className="w-8 text-center font-medium text-[#560319]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3EDF5] text-[#560319] transition-all hover:bg-[#E8DCEB]"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="flex h-8 w-8 items-center justify-center self-end text-[#946D6D] transition-all hover:scale-110 hover:text-red-600 sm:self-auto"
                              aria-label="Remove from cart"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-center justify-between border-t border-[#E8DCEB]/70 pt-2 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
                          <div className="flex items-baseline gap-1.5">
                            <Banknote
                              size={15}
                              strokeWidth={1.8}
                              className="shrink-0 translate-y-px text-emerald-700/55"
                            />
                            <span className="text-[15px] italic font-medium text-emerald-700/65">
                              {formatMVRSymbol(Number(item.product.price) * item.quantity)}
                            </span>
                            <span className="text-[15px] font-semibold text-[#560319] tabular-nums">
                              {formatMVRAmount(Number(item.product.price) * item.quantity)}
                            </span>
                          </div>

                          <p className="text-xs text-[#A290B7]">
                            {item.quantity} × {formatMVR(item.product.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-[#E8DCEB]/80 bg-white/70 p-4 backdrop-blur-xl sm:p-6">
                  <h2 className="mb-5 text-xl font-semibold text-[#560319] sm:mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-[#946D6D]">
                      <span>Subtotal</span>
                      <span>{formatMVR(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-[#946D6D]">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>

                    <div className="flex justify-between text-[#946D6D]">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>

                    <div className="border-t border-[#E8DCEB] pt-4">
                      <div className="mb-6 flex justify-between text-lg font-semibold text-[#560319]">
                        <span>Total</span>
                        <span>{formatMVR(subtotal)}</span>
                      </div>

                      <button
                        type="button"
                        className="mb-3 w-full rounded-lg bg-[#560319] px-4 py-3 font-semibold text-[#FDF4D2] transition-opacity hover:opacity-80"
                      >
                        Proceed to Checkout
                      </button>

                      <button
                        type="button"
                        onClick={() => setClearCartOpen(true)}
                        className="w-full rounded-lg px-4 py-3 font-semibold text-[#946D6D] transition-opacity hover:text-red-600"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ClearCartDialog
        open={clearCartOpen}
        onOpenChange={setClearCartOpen}
        onConfirm={clear}
      />
    </>
  );
}

export default CartPage;