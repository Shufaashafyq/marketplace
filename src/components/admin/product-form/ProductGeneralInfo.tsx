import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

type ProductGeneralInfoProps = {
  name: string;
  description: string;
  nameError: string;
  descriptionError: string;
  loading: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onNameBlur: () => void;
  onDescriptionBlur: () => void;
};

function ProductGeneralInfo({
  name,
  description,
  nameError,
  descriptionError,
  loading,
  onNameChange,
  onDescriptionChange,
  onNameBlur,
  onDescriptionBlur,
}: ProductGeneralInfoProps) {
  return (
    <section className="rounded-xl border border-[#E8DCEB] bg-white">
      <div className="border-b border-[#E8DCEB] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-r from-rose-200 via-purple-200 to-indigo-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[#8F8585]">
              1
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#560319]">
              General Information
            </h3>

            <p className="text-xs text-[#A290B7]">
              Add the basic details of your product.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Product Name */}
        <div className="space-y-2">
          <Label
            htmlFor="product-name"
            className="text-[#560319]"
          >
            Product Name
          </Label>

          <Input
            id="product-name"
            value={name}
            onChange={(event) =>
              onNameChange(event.target.value)
            }
            onBlur={onNameBlur}
            placeholder="e.g. Lavender Gift Set"
            disabled={loading}
            required
            aria-invalid={!!nameError}
            className={`border-[#E8DCEB] bg-white focus-visible:ring-[#F3EAF5] ${
              nameError
                ? "border-[#C84B5E] focus-visible:border-[#C84B5E] focus-visible:ring-[#C84B5E]"
                : ""
            }`}
          />

          {nameError && (
            <p className="text-xs text-[#C84B5E]">
              {nameError}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label
            htmlFor="product-description"
            className="text-[#560319]"
          >
            Description
          </Label>

          <Textarea
            id="product-description"
            value={description}
            onChange={(event) =>
              onDescriptionChange(event.target.value)
            }
            onBlur={onDescriptionBlur}
            placeholder="Describe the product..."
            rows={4}
            disabled={loading}
            required
            aria-invalid={!!descriptionError}
            className={`resize-none border-[#E8DCEB] bg-white focus-visible:ring-[#F3EAF5] ${
              descriptionError
                ? "border-[#C84B5E] focus-visible:border-[#C84B5E] focus-visible:ring-[#C84B5E]"
                : ""
            }`}
          />

          {descriptionError && (
            <p className="text-xs text-[#C84B5E]">
              {descriptionError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductGeneralInfo;