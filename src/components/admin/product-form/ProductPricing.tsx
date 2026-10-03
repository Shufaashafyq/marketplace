import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type ProductPricingProps = {
  price: string;
  stock: string;
  priceError: string;
  stockError: string;
  loading: boolean;
  onPriceChange: (value: string) => void;
  onStockChange: (value: string) => void;
  onPriceBlur: () => void;
  onStockBlur: () => void;
};

function ProductPricing({
  price,
  stock,
  priceError,
  stockError,
  loading,
  onPriceChange,
  onStockChange,
  onPriceBlur,
  onStockBlur,
}: ProductPricingProps) {
  return (
    <section className="rounded-xl border border-[#E8DCEB] bg-white">
      <div className="border-b border-[#E8DCEB] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-r from-rose-200 via-purple-200 to-indigo-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[#8F8585]">
              2
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#560319]">
              Pricing and Stock
            </h3>

            <p className="text-xs text-[#A290B7]">
              Set the price and available quantity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {/* Price */}
        <div className="space-y-2">
          <Label
            htmlFor="product-price"
            className="text-[#560319]"
          >
            Price
          </Label>

          <Input
            id="product-price"
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) =>
              onPriceChange(event.target.value)
            }
            onBlur={onPriceBlur}
            placeholder="25.00"
            disabled={loading}
            required
            aria-invalid={!!priceError}
            className={`border-[#E8DCEB] bg-white focus-visible:ring-[#F3EAF5] ${
              priceError
                ? "border-[#C84B5E] focus-visible:border-[#C84B5E] focus-visible:ring-[#C84B5E]"
                : ""
            }`}
          />

          {priceError && (
            <p className="text-xs text-[#C84B5E]">
              {priceError}
            </p>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <Label
            htmlFor="product-stock"
            className="text-[#560319]"
          >
            Stock
          </Label>

          <Input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(event) =>
              onStockChange(event.target.value)
            }
            onBlur={onStockBlur}
            placeholder="10"
            disabled={loading}
            required
            aria-invalid={!!stockError}
            className={`border-[#E8DCEB] bg-white focus-visible:ring-[#F3EAF5] ${
              stockError
                ? "border-[#C84B5E] focus-visible:border-[#C84B5E] focus-visible:ring-[#C84B5E]"
                : ""
            }`}
          />

          {stockError && (
            <p className="text-xs text-[#C84B5E]">
              {stockError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductPricing;