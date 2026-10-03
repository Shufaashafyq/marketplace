import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import {
  createProduct,
  updateProduct,
  type Product,
  type ProductImage as ProductImageType,
} from "../../../api/product.api";
import { toast } from "sonner";
import {
  validateProductName,
  validateProductDescription,
  validateProductPrice,
  validateProductStock,
  validateProductCategory,
  validateProductImages,
} from "../../../lib/validation";
import ProductGeneralInfo from "../product-form/ProductGeneralInfo";
import ProductPricing from "../product-form/ProductPricing";
import ProductImage  from "../product-form/ProductImage";
import ProductCategory from "../product-form/ProductCategory";

type ProductFormDialogProps = {
  product?: Product;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved: () => void;
  trigger?: React.ReactElement;
};

function ProductFormDialog({
  product,
  open,
  onOpenChange,
  onSaved,
  trigger,
}: ProductFormDialogProps) {
  const isEdit = Boolean(product);

  const [internalOpen, setInternalOpen] =
    useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const [existingImages, setExistingImages] =
    useState<ProductImageType[]>([]);

  const [images, setImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nameError, setNameError] =
    useState("");
  const [descriptionError, setDescriptionError] =
    useState("");
  const [priceError, setPriceError] =
    useState("");
  const [stockError, setStockError] =
    useState("");
  const [categoryError, setCategoryError] =
    useState("");
  const [imageError, setImageError] =
    useState("");

  const dialogOpen = open ?? internalOpen;

  function setDialogOpen(value: boolean) {
    onOpenChange?.(value);

    if (open === undefined) {
      setInternalOpen(value);
    }
  }

  function populateForm(current?: Product) {
    setName(current?.name ?? "");
    setDescription(current?.description ?? "");
    setPrice(current?.price ?? "");
    setStock(
      current ? String(current.stock) : ""
    );
    setCategory(current?.category ?? "");
    setBrand(current?.brand ?? "");

    setExistingImages(current?.images ?? []);
    setImages([]);

    setError("");

    setNameError("");
    setDescriptionError("");
    setPriceError("");
    setStockError("");
    setCategoryError("");
    setImageError("");
  }

  useEffect(() => {
    if (dialogOpen) {
      populateForm(product);
    }
  }, [dialogOpen, product?.id]);

  const isFormValid =
    !validateProductName(name) &&
    !validateProductDescription(description) &&
    !validateProductPrice(price) &&
    !validateProductStock(stock) &&
    !validateProductCategory(category) &&
    !validateProductImages(
      existingImages.length,
      images.length
    );

  function handleNameChange(value: string) {
    setName(value);

    if (nameError) {
      setNameError(
        validateProductName(value)
      );
    }
  }

  function handleDescriptionChange(
    value: string
  ) {
    setDescription(value);

    if (descriptionError) {
      setDescriptionError(
        validateProductDescription(value)
      );
    }
  }

  function handlePriceChange(value: string) {
    setPrice(value);

    if (priceError) {
      setPriceError(
        validateProductPrice(value)
      );
    }
  }

  function handleStockChange(value: string) {
    setStock(value);

    if (stockError) {
      setStockError(
        validateProductStock(value)
      );
    }
  }

  function handleCategoryChange(
    value: string
  ) {
    setCategory(value);

    if (categoryError) {
      setCategoryError(
        validateProductCategory(value)
      );
    }
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    const updatedImages = [
      ...images,
      ...selectedFiles,
    ];

    setImages(updatedImages);

    if (imageError) {
      setImageError(
        validateProductImages(
          existingImages.length,
          updatedImages.length
        )
      );
    }

    event.target.value = "";
  }

  function removeNewImage(index: number) {
    const updatedImages = images.filter(
      (_, imageIndex) =>
        imageIndex !== index
    );

    setImages(updatedImages);

    setImageError(
      validateProductImages(
        existingImages.length,
        updatedImages.length
      )
    );
  }

  function removeExistingImage(id: string) {
    const updatedImages =
      existingImages.filter(
        (image) => image.id !== id
      );

    setExistingImages(updatedImages);

    setImageError(
      validateProductImages(
        updatedImages.length,
        images.length
      )
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const nameValidation =
      validateProductName(name);

    const descriptionValidation =
      validateProductDescription(description);

    const priceValidation =
      validateProductPrice(price);

    const stockValidation =
      validateProductStock(stock);

    const categoryValidation =
      validateProductCategory(category);

    const imageValidation =
      validateProductImages(
        existingImages.length,
        images.length
      );

    setNameError(nameValidation);
    setDescriptionError(
      descriptionValidation
    );
    setPriceError(priceValidation);
    setStockError(stockValidation);
    setCategoryError(categoryValidation);
    setImageError(imageValidation);

    if (
      nameValidation ||
      descriptionValidation ||
      priceValidation ||
      stockValidation ||
      categoryValidation ||
      imageValidation
    ) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append(
        "brand",
        brand.trim()
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      if (isEdit && product) {
        formData.append(
          "existingImageIds",
          JSON.stringify(
            existingImages.map(
              (image) => image.id
            )
          )
        );

        await updateProduct(
          product.id,
          formData
        );

        toast.success(
          "Product updated successfully"
        );
      } else {
        await createProduct(formData);

        toast.success(
          "Product added successfully"
        );
      }

      setDialogOpen(false);
      onSaved();
    } catch (submitError) {
      console.error(
        isEdit
          ? "Failed to update product:"
          : "Failed to create product:",
        submitError
      );

      const message = isEdit
        ? "Failed to update product. Please try again."
        : "Failed to create product. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(value) => {
        setDialogOpen(value);

        if (!value) {
          populateForm(product);
        }
      }}
    >
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : null}

      <DialogContent className="max-h-[90vh] overflow-y-auto border-[#E8DCEB] bg-[#FDFCFD] sm:max-w-4xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-2xl font-semibold text-[#560319]">
            {isEdit
              ? "Edit Product"
              : "Add Product"}
          </DialogTitle>

          <DialogDescription className="text-sm text-[#8F8585]">
            {isEdit
              ? "Update this product in your marketplace catalogue."
              : "Add a product to your marketplace catalogue."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ProductGeneralInfo
              name={name}
              description={description}
              nameError={nameError}
              descriptionError={descriptionError}
              loading={loading}
              onNameChange={handleNameChange}
              onDescriptionChange={
                handleDescriptionChange
              }
              onNameBlur={() =>
                setNameError(
                  validateProductName(name)
                )
              }
              onDescriptionBlur={() =>
                setDescriptionError(
                  validateProductDescription(
                    description
                  )
                )
              }
            />

            <ProductPricing
              price={price}
              stock={stock}
              priceError={priceError}
              stockError={stockError}
              loading={loading}
              onPriceChange={handlePriceChange}
              onStockChange={handleStockChange}
              onPriceBlur={() =>
                setPriceError(
                  validateProductPrice(price)
                )
              }
              onStockBlur={() =>
                setStockError(
                  validateProductStock(stock)
                )
              }
            />

            <ProductImage
              existingImages={existingImages}
              images={images}
              imageError={imageError}
              loading={loading}
              onImageChange={handleImageChange}
              onRemoveExisting={
                removeExistingImage
              }
              onRemoveNew={removeNewImage}
            />

            <ProductCategory
              category={category}
              brand={brand}
              categoryError={categoryError}
              loading={loading}
              onCategoryChange={
                handleCategoryChange
              }
              onBrandChange={setBrand}
              onCategoryBlur={() =>
                setCategoryError(
                  validateProductCategory(category)
                )
              }
            />
          </div>

          {error && (
            <div className="rounded-lg border border-[#E8BDBD] bg-[#FDF1F1] px-3 py-2.5 text-sm text-[#A34848]">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-[#E8DCEB] pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDialogOpen(false)
              }
              disabled={loading}
              className="border-[#E8DCEB] text-[#8F8585] hover:bg-[#F3EAF5]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="bg-[#560319] text-white hover:bg-[#3D0112] disabled:cursor-not-allowed disabled:bg-[#E8DCEB] disabled:text-[#A290B7]"
            >
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Adding Product..."
                : isEdit
                  ? "Save Changes"
                  : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductFormDialog;