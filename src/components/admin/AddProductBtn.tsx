import { Button } from "../ui/button";
import ProductFormDialog from "./dialogs/ProductFormDialog";

type AddProductDialogProps = {
  onProductCreated: () => void;
};

function AddProductDialog({ onProductCreated }: AddProductDialogProps) {
  return (
    <ProductFormDialog
      onSaved={onProductCreated}
      trigger={
        <Button
          className="
            relative overflow-hidden
            rounded-xl
            px-6 py-5
            border border-white/30
            bg-[#560319]
            text-white
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.35),inset_-1px_-2px_3px_rgba(0,0,0,0.2),0_4px_12px_rgba(86,3,25,0.18)]
            transition-all duration-300 ease-out
            hover:bg-[#6D0A29]
            hover:border-white/50
            hover:shadow-[inset_1px_1px_3px_rgba(255,255,255,0.5),inset_-1px_-2px_3px_rgba(0,0,0,0.15),0_8px_20px_rgba(86,3,25,0.25)]
            active:scale-[0.97]
            focus-visible:ring-2
            focus-visible:ring-[#560319]/30
            focus-visible:ring-offset-2"
        >
          <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/25 via-white/5 to-transparent opacity-90" />

          <span className="relative z-10">
            Add Product
          </span>
        </Button>
      }
    />
  );
}

export default AddProductDialog;
