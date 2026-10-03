import { useState } from "react";
import {
  AlertTriangle,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { deleteProduct } from "../../../api/product.api";
import type { Product } from "../../../api/product.api";
import { toast } from "sonner";

type DeleteProductDialogProps = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

function DeleteProductDialog({
  product,
  open,
  onOpenChange,
  onDeleted,
}: DeleteProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");

    try {
      setLoading(true);

      await deleteProduct(product.id);

      toast.success(`${product.name} removed successfully`);

      onOpenChange(false);
      onDeleted();
    } catch (deleteError) {
      console.error("Failed to delete product:", deleteError);

      const message =
        "Failed to remove product. Please try again.";

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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EAF5] text-[#A34848]">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <DialogTitle className="text-xl font-semibold text-[#560319]">
                Delete product?
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm leading-6 text-[#8F8585]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#560319]">
                  "{product.name}"
                </span>
                ?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Warning */}
        <div className="rounded-xl border border-[#E8BDBD] bg-[#FDF1F1] px-4 py-3 text-sm leading-6 text-[#A34848]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

            <p>
              This will permanently remove the product
              from your catalogue. This action cannot be
              undone.
            </p>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-[#E8BDBD] bg-[#FDF1F1] px-3 py-2.5 text-sm text-[#A34848]">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-[#E8DCEB] pt-5">
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
            onClick={handleDelete}
            className="h-11 rounded-lg bg-[#A34848] px-5 text-white hover:bg-[#8B3838]"
          >
            <Trash2 className="mr-2 h-4 w-4" />

            {loading ? "Deleting..." : "Delete product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteProductDialog;