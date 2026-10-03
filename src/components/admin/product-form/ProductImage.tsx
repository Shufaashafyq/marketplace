import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import type { ProductImage as ProductImageType } from "../../../api/product.api";

type ProductImageProps = {
  existingImages: ProductImageType[];
  images: File[];
  imageError: string;
  loading: boolean;
  onImageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onRemoveExisting: (id: string) => void;
  onRemoveNew: (index: number) => void;
};

function ProductImage({
  existingImages,
  images,
  imageError,
  loading,
  onImageChange,
  onRemoveExisting,
  onRemoveNew,
}: ProductImageProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  return (
    <section className="rounded-xl border border-[#E8DCEB] bg-white">
      <div className="border-b border-[#E8DCEB] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-r from-rose-200 via-purple-200 to-indigo-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[#8F8585]">
              3
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#560319]">
              Upload Images
            </h3>

            <p className="text-xs text-[#A290B7]">
              Add product images for your listing.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onImageChange}
          className="hidden"
        />

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            fileInputRef.current?.click()
          }
          className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-7 text-sm text-[#8F8585] transition-colors hover:bg-[#F3EAF5] disabled:cursor-not-allowed disabled:opacity-60 ${
            imageError
              ? "border-[#C84B5E] bg-[#FDF1F1]"
              : "border-[#C8B3CE] bg-[#F9F5FA]"
          }`}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EAF5]">
            <ImagePlus className="h-5 w-5 text-[#A290B7]" />
          </div>

          <span className="font-medium text-[#560319]">
            Click to upload product images
          </span>

          <span className="mt-1 text-xs text-[#A290B7]">
            Add up to 10 images
          </span>
        </button>

        {(existingImages.length > 0 ||
          images.length > 0) && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {existingImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[#E8DCEB] bg-[#F3EDF5]"
              >
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {index === 0 &&
                  images.length === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-[#560319] px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Primary
                    </span>
                  )}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    onRemoveExisting(image.id)
                  }
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#560319] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[#E8DCEB] bg-[#F3EDF5]"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Product preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {existingImages.length === 0 &&
                  index === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-[#560319] px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Primary
                    </span>
                  )}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    onRemoveNew(index)
                  }
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#560319] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                  aria-label={`Remove ${image.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {imageError && (
          <p className="mt-3 text-xs text-[#C84B5E]">
            {imageError}
          </p>
        )}
      </div>
    </section>
  );
}

export default ProductImage;