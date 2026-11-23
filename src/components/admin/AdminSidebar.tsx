import {
  LayoutDashboard,
  LogOut,
  Package,
  Tags,
  Activity,
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
  {
    label: "Audit Logs",
    path: "/admin/audit",
    icon: Activity,
  },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="w-full shrink-0 border-b border-[#E8DCEB] bg-white sm:sticky sm:top-0 sm:flex sm:h-[calc(100vh-4rem)] sm:w-60 sm:flex-col sm:border-b-0 sm:border-r">
      <div className="overflow-x-auto px-2 py-2 sm:flex-1 sm:overflow-y-auto sm:overflow-x-hidden sm:px-4 sm:py-6">
        <p className="hidden px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A290B7] sm:block">
          Management
        </p>

        <nav className="flex min-w-max gap-1 sm:mt-4 sm:min-w-0 sm:flex-col sm:space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors sm:w-full sm:justify-start sm:py-2.5 sm:text-sm ${
                    isActive
                      ? "bg-[#560319] font-medium text-white"
                      : "text-[#8F8585] hover:bg-[#FAF6F6] hover:text-[#560319]"
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.8} className="sm:h-4.5 sm:w-4.5" />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
          <button
            type="button"
            onClick={async () => {
              try {
                await logout();
              } finally {
                navigate("/login");
              }
            }}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#8F8585] transition-colors hover:bg-[#FAF6F6] hover:text-[#560319] sm:hidden"
          >
            <LogOut size={16} strokeWidth={1.8} />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </nav>
      </div>

      <div className="hidden border-t border-[#E8DCEB] px-4 pb-7 pt-4 sm:block">
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