import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../api/product.api";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistCount,
} from "../api/wishlist.api";
import { useAuth } from "./AuthContext";

type WishlistContextType = {
  wishlistProducts: Product[];
  wishlistCount: number;
  loading: boolean;
  isProductLiked: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function refreshWishlist() {
    if (!user) {
      setWishlistProducts([]);
      setWishlistCount(0);
      return;
    }

    setLoading(true);
    try {
      const [products, count] = await Promise.all([
        getWishlist(),
        getWishlistCount(),
      ]);
      setWishlistProducts(products);
      setWishlistCount(count);
    } catch (error) {
      console.error("Failed to refresh wishlist:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleWishlist(product: Product) {
    const isLiked = isProductLikedLocal(product.id);

    try {
      if (isLiked) {
        await removeFromWishlist(product.id);
        setWishlistProducts((current) =>
          current.filter((p) => p.id !== product.id)
        );
        setWishlistCount((current) => Math.max(0, current - 1));
      } else {
        await addToWishlist(product.id);
        setWishlistProducts((current) => [product, ...current]);
        setWishlistCount((current) => current + 1);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      throw error;
    }
  }

  function isProductLikedLocal(productId: string) {
    return wishlistProducts.some((p) => p.id === productId);
  }

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistProducts,
        wishlistCount,
        loading,
        isProductLiked: isProductLikedLocal,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
