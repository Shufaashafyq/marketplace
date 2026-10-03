import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import type { Product } from "../../../api/product.api";

type ViewProductDialogProps = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ViewProductDialog({
  product,
  open,
  onOpenChange,
}: ViewProductDialogProps) {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = product.images[selectedIndex] ?? product.images[0];
  const isOutOfStock = product.stock === 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);

        if (!value) {
          setSelectedIndex(0);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[#E8DCEB] bg-[#FDFCFD] sm:max-w-3xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-2xl font-semibold text-[#560319]">
            {product.name}
          </DialogTitle>

          <DialogDescription className="text-sm text-[#8F8585]">
            Review this product before editing or sharing it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <div className="overflow-hidden rounded-xl border border-[#E8DCEB] bg-[#F3EDF5]">
              {selectedImage ? (
                <img
                  src={selectedImage.url}
                  alt={product.name}
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-sm text-[#A290B7]">
                  No image
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`overflow-hidden rounded-lg border ${
                      selectedIndex === index
                        ? "border-[#560319]"
                        : "border-[#E8DCEB]"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="aspect-square h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A290B7]">
                {product.category}
              </p>

              {product.brand && (
                <p className="mt-1 text-sm text-[#8F8585]">{product.brand}</p>
              )}
            </div>

            <p className="text-2xl font-semibold text-[#560319]">
              ${product.price}
            </p>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                isOutOfStock
                  ? "bg-[#F9E6E6] text-[#A34848]"
                  : "bg-[#EAF5ED] text-[#477A55]"
              }`}
            >
              {isOutOfStock
                ? "Out of stock"
                : `${product.stock} in stock`}
            </span>

            <p className="text-sm leading-6 text-[#6F6666]">
              {product.description}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#E8DCEB] pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E8DCEB] text-[#8F8585] hover:bg-[#F3EAF5]"
          >
            Close
          </Button>

          <Button
            type="button"
            onClick={() => navigate(`/products/${product.id}`)}
            className="bg-[#560319] text-white hover:bg-[#3D0112]"
          >
            Open store page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewProductDialog;
