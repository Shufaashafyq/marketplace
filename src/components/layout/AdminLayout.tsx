import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "../admin/AdminHeader";
import AdminSidebar from "../admin/AdminSidebar";

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F7]">
        <p className="text-sm text-[#A290B7]">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <AdminHeader />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

