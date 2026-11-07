import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";

type ClearCartDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
};

function ClearCartDialog({
  open,
  onOpenChange,
  onConfirm,
}: ClearCartDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClearCart() {
    setError("");

    try {
      setLoading(true);

      await onConfirm();

      toast.success("Your cart has been cleared.");

      onOpenChange(false);
    } catch (clearError) {
      console.error("Failed to clear cart:", clearError);

      const message = "Failed to clear your cart. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="border-[#E8DCEB] bg-[#FDFCFD] shadow-[0_20px_60px_rgba(86,3,25,0.12)] sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDF1F1] text-[#A34848]">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <DialogTitle className="text-xl font-semibold text-[#560319]">
                Clear your cart?
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm leading-6 text-[#8F8585]">
                Are you sure you want to remove all items
                from your shopping cart?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-xl border border-[#E8BDBD] bg-[#FDF1F1] px-4 py-3 text-sm leading-6 text-[#A34848]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

            <p>
              All items will be removed from your cart.
              You will need to add them again if you
              change your mind.
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-[#E8BDBD] bg-[#FDF1F1] px-3 py-2.5 text-sm text-[#A34848]"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[#E8DCEB] pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-lg border-[#E8DCEB] bg-white px-5 text-[#560319] hover:bg-[#F3EAF5]"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={handleClearCart}
            className="h-11 rounded-lg bg-[#A34848] px-5 text-white hover:bg-[#8B3838]"
          >
            <Trash2 className="mr-2 h-4 w-4" />

            {loading ? "Clearing..." : "Clear cart"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClearCartDialog;

