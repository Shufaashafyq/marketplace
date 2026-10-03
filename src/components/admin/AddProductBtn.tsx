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
        <Button className="bg-[#560319] text-white hover:bg-[#3D0112]">
          Add Product
        </Button>
      }
    />
  );
}

export default AddProductDialog;
