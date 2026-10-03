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
    <aside className="sticky top-0 flex h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-[#E8DCEB] bg-white">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A290B7]">
          Management
        </p>

        <nav className="mt-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
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

      <div className="border-t border-[#E8DCEB] px-4 pb-7 pt-4">
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