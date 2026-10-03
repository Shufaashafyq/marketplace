import { User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileDialog from "../profile/ProfileDialog";

function AdminHeader() {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-[#560319]">
      <div className="mx-auto flex h-20 items-center justify-between px-5">
        <div>
          <h1
            className="text-3xl text-[#FDF4D2] sm:text-4xl"
            style={{ fontFamily: "'Estonia', cursive" }}
          >
            The Art of Gift Giving
          </h1>
        </div>

        <div className="flex items-center gap-6">
         
          {/* Admin Profile */}
          <div className="flex items-center gap-3 border-l border-[#FDF4D2]/20 pl-5">
            <div className="relative">
              <button
                type="button"
                aria-label="Administrator profile"
                onClick={() => setProfileOpen(true)}
                className="flex items-center justify-center text-[#FDF4D2] transition-opacity hover:opacity-70"
              >
                <User size={21} strokeWidth={1.8} />
              </button>

              <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#FDF4D2] px-2.5 py-1.5 text-xs font-medium text-[#946D6D] opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                Profile
              </span>

              <ProfileDialog
                open={profileOpen}
                onOpenChange={(next) => setProfileOpen(next)}
              />
            </div>

            {/* Admin Details */}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[#FDF4D2]">
                {user?.name}
              </p>

              <p className="text-[10px] uppercase tracking-[0.14em] text-[#FDF4D2]/60">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;