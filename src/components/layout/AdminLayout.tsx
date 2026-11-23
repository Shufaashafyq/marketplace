import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "../admin/AdminHeader";
import AdminSidebar from "../admin/AdminSidebar";
import { AdminDashboardSkeleton } from "../admin/AdminSkeleton";

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F7]">
        <div className="h-16 border-b border-[#E8DCEB] bg-white" />
        <div className="flex">
          <div className="hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-[#E8DCEB] bg-white sm:block" />
          <div className="min-w-0 flex-1">
            <AdminDashboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <AdminHeader />

      <div className="flex min-h-[calc(100vh-4rem)] flex-col sm:flex-row">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

