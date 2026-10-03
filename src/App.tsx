import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLayout from "./components/layout/AdminLayout";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
    <WishlistProvider>
    <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        </Route>
        

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
      <Toaster
      position="bottom-right"
      toastOptions={{
      style: {
      background: "#F3EAF5",
      border: "1px solid #E8DCEB",
      color: "#560319",
      borderRadius: "12px",
      boxShadow: "0 8px 30px rgba(86, 3, 25, 0.10)",
    },
  }}
/>
       
       
    </BrowserRouter>
    </CartProvider>
    </WishlistProvider>
    </AuthProvider>
  );
}

export default App;

