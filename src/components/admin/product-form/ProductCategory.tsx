import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { CATEGORIES } from "../../../lib/categories";

type ProductCategoryProps = {
  category: string;
  brand: string;
  categoryError: string;
  loading: boolean;
  onCategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onCategoryBlur: () => void;
};

function ProductCategory({
  category,
  brand,
  categoryError,
  loading,
  onCategoryChange,
  onBrandChange,
  onCategoryBlur,
}: ProductCategoryProps) {
  return (
    <section className="rounded-xl border border-[#E8DCEB] bg-white">
      <div className="border-b border-[#E8DCEB] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-r from-rose-200 via-purple-200 to-indigo-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[#8F8585]">
              4
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#560319]">
              Categories and Brand
            </h3>

            <p className="text-xs text-[#A290B7]">
              Organize your product and add its brand.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5">
        {/* Category */}
        <div className="space-y-2">
          <Label
            htmlFor="product-category"
            className="text-[#560319]"
          >
            Category
          </Label>

          <select
            id="product-category"
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
            onBlur={onCategoryBlur}
            disabled={loading}
            required
            aria-invalid={!!categoryError}
            className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-[#560319] outline-none focus:border-[#C8B3CE] focus:ring-2 focus:ring-[#F3EAF5] disabled:cursor-not-allowed disabled:opacity-60 ${
              categoryError
                ? "border-[#C84B5E] focus:border-[#C84B5E] focus:ring-[#C84B5E]"
                : "border-[#E8DCEB]"
            }`}
          >
            <option value="">
              Select category
            </option>

            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {categoryError && (
            <p className="text-xs text-[#C84B5E]">
              {categoryError}
            </p>
          )}
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label
            htmlFor="product-brand"
            className="text-[#560319]"
          >
            Brand
          </Label>

          <Input
            id="product-brand"
            value={brand}
            onChange={(event) =>
              onBrandChange(event.target.value)
            }
            placeholder="Optional"
            disabled={loading}
            className="border-[#E8DCEB] bg-white focus-visible:ring-[#F3EAF5]"
          />
        </div>
      </div>
    </section>
  );
}

export default ProductCategory;