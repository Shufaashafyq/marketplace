import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ProductsHeaderProps = {
  search: string;
  category: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

function ProductsHeader({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}: ProductsHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  function toggleSearch() {
    setShowSearch((current) => !current);
  }

  function closeSearch() {
    onSearchChange("");
    setShowSearch(false);
  }

  return (
    <section id="our-gifts" className="relative w-full overflow-hidden">
      <img
        src="/images/water.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2
            className="text-4xl leading-none md:text-5xl"
            style={{
              color: "#FDF4D2",
              fontFamily: "'Estonia', cursive",
            }}
          >
            Our Gifts
          </h2>

          <p className="mt-1.5 text-sm text-[#FDF4D2]/85">
            Find something meaningful for every occasion.
          </p>
        </div>

       
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {showSearch && (
            <div className="relative">
              <Search
                size={16}
                strokeWidth={1.8}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A290B7]"
              />

              <Input
                autoFocus
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search gifts..."
                className="h-10 w-52 border-0 bg-white pl-9 pr-9 text-sm text-[#946D6D] shadow-none placeholder:text-[#A8A0AE] focus-visible:ring-0"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={closeSearch}
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-[#A290B7] hover:bg-transparent hover:text-[#946D6D]"
                aria-label="Close search"
              >
                <X size={15} />
              </Button>
            </div>
          )}
     
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className={`h-10 w-10 text-[#FDF4D2] hover:bg-white/10 hover:text-[#FDF4D2] ${
              showSearch ? "bg-white/20" : ""
            }`}
            aria-label="Search products"
          >
            <Search size={19} strokeWidth={1.8} />
          </Button>

          {/* Category filter */}
          <Popover>
            <PopoverTrigger
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#FDF4D2] transition-colors hover:bg-white/10"
              aria-label="Filter products"
            >
              <SlidersHorizontal size={19} strokeWidth={1.8} />
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-52 rounded-xl border border-[#E8DCEB] bg-white p-2 text-[#946D6D] shadow-lg"
            >
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#A290B7]">
                Category
              </p>

              <Button
                type="button"
                variant="ghost"
                onClick={() => onCategoryChange("all")}
                className={`h-auto w-full justify-start rounded-lg px-3 py-2 text-sm ${
                  category === "all"
                    ? "bg-[#F0EAF5] font-medium text-[#946D6D]"
                    : "text-[#8F8585] hover:bg-[#F8F8F7]"
                }`}
              >
                All Gifts
              </Button>

              {categories.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="ghost"
                  onClick={() => onCategoryChange(item)}
                  className={`h-auto w-full justify-start rounded-lg px-3 py-2 text-sm ${
                    category === item
                      ? "bg-[#F0EAF5] font-medium text-[#946D6D]"
                      : "text-[#8F8585] hover:bg-[#F8F8F7]"
                  }`}
                >
                  {item}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  );
}

export default ProductsHeader;
