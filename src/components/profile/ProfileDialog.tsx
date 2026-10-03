import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";
import api from "../../api/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Profile = {
  id: string;
  name: string;
  email: string;
};

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ProfileDialog({
  open,
  onOpenChange,
}: ProfileDialogProps) {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/auth/me");

      const user = response.data.user;

      setProfile(user);
      setName(user.name ?? "");
    } catch (error) {
      console.error("Failed to load profile:", error);

      setError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  async function handleSave() {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await api.patch("/auth/profile", {
        name: name.trim(),
      });

      const updatedUser = response.data.user;

      setProfile(updatedUser);
      setName(updatedUser.name ?? "");

      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) {
      return;
    }

    setError("");
    onOpenChange(false);
  }

  const initials =
    name.trim().charAt(0).toUpperCase() || "S";

  const hasChanges =
    name.trim() !== (profile?.name ?? "");

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!saving) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="border-[#E8DCEB] bg-[#FFFCFC] shadow-[0_20px_60px_rgba(86,3,25,0.12)] xm:max-w-md">
        {/* Header */}
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EAF5] text-[#560319]">
              <User className="h-5 w-5" />
            </div>

            <div>
              <DialogTitle className="text-2xl font-semibold text-[#560319]">
                My Profile
              </DialogTitle>

              <DialogDescription className="mt-0.5 text-sm leading-5 text-[#8F8585]">
                Manage your profile information.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex min-h-62.5 items-center justify-center">
            <p className="text-sm text-[#A290B7]">
              Loading profile...
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {/* Profile Avatar */}
            <div className="flex flex-col items-center pt-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#E8DCEB] bg-[#F3EAF5] shadow-sm">
                <span className="text-3xl font-semibold text-[#560319]">
                  {initials}
                </span>
              </div>

              <p className="mt-3 text-xs font-medium tracking-wide text-[#A290B7]">
                Account profile
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E8DCEB]" />

            {/* Personal Information */}
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-[#560319]">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#8F8585]">
                  Keep your account details up to date.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="profile-name"
                  className="text-sm font-medium text-[#560319]"
                >
                  Name
                </Label>

                <Input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Your name"
                  disabled={saving}
                  className="h-11 rounded-lg border-[#E8DCEB] bg-white text-[#560319] shadow-none placeholder:text-[#A290B7] transition-colors hover:border-[#D6C5DC] focus-visible:border-[#A290B7] focus-visible:ring-2 focus-visible:ring-[#A290B7]/20"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="profile-email"
                  className="text-sm font-medium text-[#560319]"
                >
                  Email
                </Label>

                <Input
                  id="profile-email"
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="h-11 rounded-lg border-[#E8DCEB] bg-[#F3EAF5]/70 text-[#8F8585] shadow-none"
                />

                <p className="text-[11px] leading-5 text-[#A290B7]">
                  Email cannot be changed here.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-[#E8DCEB] bg-[#FBE8EC] px-3 py-2.5 text-sm text-[#A34848]">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="border-t border-[#E8DCEB] pt-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={handleClose}
            className="h-10 rounded-lg border-[#E8DCEB] bg-white px-5 text-sm font-medium text-[#560319] shadow-none hover:bg-[#F3EAF5] hover:text-[#560319]"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              loading ||
              saving ||
              !profile ||
              !hasChanges
            }
            onClick={handleSave}
            className="h-10 rounded-lg bg-[#560319] px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#3D0112]"
          >
            <Save className="mr-2 h-4 w-4" />

            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog;