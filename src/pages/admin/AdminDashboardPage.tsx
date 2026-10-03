import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminDashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/products" replace />;
  }

  return (
    <main className="min-h-screen bg-[#F8F8F7] p-8">
      <h1
        className="text-7xl leading-none text-[#560319]"
        style={{ fontFamily: "'Estonia', cursive" }}
      >
        Admin Dashboard
      </h1>

      <p className="mt-2 text-sm text-[#946D6D]">
        Welcome back, {user.name}.
      </p>
      <br/>

      <p className="mt-2 max-w-xl text-xs leading-6 text-[#946D6D]">
        Welcome to your marketplace dashboard. From here, you can manage
        Products, Update Product Stock levels and keep your catalogue running smoothly.
      </p>
    </main>
  );
}

export default AdminDashboardPage;