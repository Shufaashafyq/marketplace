import { useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";
import type { Product } from "../../../api/product.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type UpdateStockDialogProps = {
  product: Product;
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (stock: number) => Promise<void>;
};

function UpdateStockDialog({
  product,
  open,
  loading = false,
  onOpenChange,
  onUpdate,
}: UpdateStockDialogProps) {
  const [stock, setStock] = useState(String(product.stock));
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStock(String(product.stock));
      setError("");
    }
  }, [open, product]);

  function handleStockChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    setStock(value);

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const numericStock = Number(stock);

    if (stock.trim() === "") {
      setError("Stock quantity is required.");
      return;
    }

    if (!Number.isInteger(numericStock)) {
      setError("Stock must be a whole number.");
      return;
    }

    if (numericStock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    await onUpdate(numericStock);
  }

  const primaryImage =
    product.images.find(
      (image) => image.isPrimary
    ) ?? product.images[0];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-w-md border-[#E8DCEB] bg-[#FFFCFC] p-0 shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <DialogHeader className="border-b border-[#E8DCEB] px-6 py-5">
            <DialogTitle className="text-lg font-semibold text-[#560319]">
              Update Stock
            </DialogTitle>

            <DialogDescription className="text-xs leading-5 text-[#8F8585]">
              Update the available quantity for this product.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6 py-6">
            {/* Product */}
            <div className="flex items-center gap-3 rounded-xl border border-[#E8DCEB] bg-white p-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F3EDF5]">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package
                      size={18}
                      className="text-[#A290B7]"
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p
                  className="truncate text-2xl leading-none text-[#560319]"
                  style={{
                    fontFamily: "'Estonia', cursive",
                  }}
                >
                  {product.name}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#A290B7]">
                  {product.category}
                </p>
              </div>
            </div>

            {/* Current stock */}
            <div className="flex items-center justify-between rounded-xl bg-[#F3EAF5] px-4 py-3">
              <span className="text-xs font-medium text-[#8F8585]">
                Current stock
              </span>

              <span className="text-lg font-semibold text-[#560319]">
                {product.stock}
              </span>
            </div>

            {/* Stock input */}
            <div className="space-y-2">
              <Label
                htmlFor="stock"
                className="text-sm font-medium text-[#560319]"
              >
                New stock quantity
              </Label>

              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={handleStockChange}
                disabled={loading}
                autoFocus
                className={`h-11 border-[#E8DCEB] bg-white text-[#560319] shadow-none focus-visible:border-[#A290B7] focus-visible:ring-[#A290B7] ${
                  error
                    ? "border-[#C84B5E] focus-visible:border-[#C84B5E] focus-visible:ring-[#C84B5E]"
                    : ""
                }`}
              />

              {error && (
                <p className="text-xs text-[#C84B5E]">
                  {error}
                </p>
              )}

              <p className="text-[11px] leading-5 text-[#A290B7]">
                Enter the total number of units currently available.
              </p>
            </div>
          </div>

          <DialogFooter className="border-t border-[#E8DCEB] px-6 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="border-[#E8DCEB] bg-white text-[#560319] hover:bg-[#F3EAF5]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#560319] text-white hover:bg-[#3D0112]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Stock"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateStockDialog;