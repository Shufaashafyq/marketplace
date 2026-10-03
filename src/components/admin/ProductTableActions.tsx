import { useState } from "react";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import type { Product } from "../../api/product.api";
import ViewProductDialog from "./dialogs/ViewProductDialog";
import ProductFormDialog from "./dialogs/ProductFormDialog";
import DeleteProductDialog from "./dialogs/DeleteProductDialog";

type ProductTableActionsProps = {
  product: Product;
  onProductsChanged: () => void;
};

function ProductTableActions({
  product,
  onProductsChanged,
}: ProductTableActionsProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-[#946D6D] hover:bg-[#F3EAF5] hover:text-[#560319]"
            >
              <span className="sr-only">
                Open actions for {product.name}
              </span>

              <MoreHorizontal
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </Button>
          }
        />

        <DropdownMenuContent
          align="end"
          className="w-48 border border-[#E8DCEB]/70 bg-[#FFFCFC] shadow-[0_4px_14px_rgba(86,3,25,0.08)] outline-none ring-0"
        >
          <div className="px-2.5 py-1.5">
            <p className="text-sm font-semibold text-[#560319]">
              Product actions
            </p>
          </div>

          <DropdownMenuSeparator className="bg-[#E8DCEB]/70" />

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 font-normal text-[#705F67] transition-colors focus:bg-[#F3EAF5] focus:text-[#560319]"
            onClick={() => setViewOpen(true)}
          >
            <Eye
              className="h-4 w-4 text-[#8F8585]"
              strokeWidth={1.8}
            />
            <span>View product</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 font-normal text-[#705F67] transition-colors focus:bg-[#F3EAF5] focus:text-[#560319]"
            onClick={() => setEditOpen(true)}
          >
            <Pencil
              className="h-4 w-4 text-[#8F8585]"
              strokeWidth={1.8}
            />
            <span>Edit product</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#E8DCEB]/70" />

          <DropdownMenuItem
            variant="destructive"
            className="flex cursor-pointer items-center gap-2 font-normal text-[#A34848] transition-colors focus:bg-[#FBE8EC] focus:text-[#B13F56]"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2
              className="h-4 w-4 text-[#B4777F]"
              strokeWidth={1.8}
            />
            <span>Delete product</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewProductDialog
        product={product}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <ProductFormDialog
        product={product}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={onProductsChanged}
      />

      <DeleteProductDialog
        product={product}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onProductsChanged}
      />
    </>
  );
}

export default ProductTableActions;
