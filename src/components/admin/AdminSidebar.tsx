import {
  LayoutDashboard,
  LogOut,
  Package,
  Tags,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },

  {
    label: "Inventory",
    path: "/admin/inventory",
    icon: Package,
  },

  {
    label: "Products",
    path: "/admin/products",
    icon: Tags,
  },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="border-b border-[#E8DCEB] bg-white sm:sticky sm:top-0 sm:h-[calc(100vh-4rem)] sm:w-60 sm:shrink-0 sm:border-b-0 sm:border-r">
      <div className="overflow-x-auto px-3 py-3 sm:h-full sm:flex-1 sm:overflow-y-auto sm:px-4 sm:py-6">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A290B7] sm:px-3">
          Management
        </p>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:mt-4 sm:block sm:space-y-1 sm:overflow-visible sm:pb-0">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#F3EAF5] font-medium text-[#560319]"
                      : "text-[#8F8585] hover:bg-[#FAF6F6] hover:text-[#560319]"
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#E8DCEB] px-3 pb-3 pt-3 sm:px-4 sm:pb-7 sm:pt-4">
        <button
          type="button"
          onClick={async () => {
            try {
              await logout();
            } finally {
              navigate("/login");
            }
          }}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#8F8585] transition-colors hover:bg-[#FAF6F6] hover:text-[#560319]"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;