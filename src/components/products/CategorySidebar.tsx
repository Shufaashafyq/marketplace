import { useEffect, useState } from "react";
import { X } from "lucide-react";

type CategorySidebarProps = {
  open: boolean;
  category: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onClose: () => void;
};

function CategorySidebar({
  open,
  category,
  categories,
  onCategoryChange,
  onClose,
}: CategorySidebarProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!mounted) {
    return null;
  }

  function handleCategoryChange(value: string) {
    onCategoryChange(value);
    onClose();
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close categories"
        onClick={onClose}
        className={`fixed inset-0 z-40 cursor-default bg-black/20 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-80 bg-[#FFFDFC] px-7 py-8 shadow-xl transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A290B7]">
              Shop by
            </p>

            <h2
              className="mt-1 text-4xl leading-none text-[#946D6D]"
              style={{
                fontFamily: "'Estonia', cursive",
              }}
            >
              Category
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close categories"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#946D6D] transition-colors hover:bg-[#F8F0F0]"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-10 space-y-1">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-colors ${
              category === "all"
                ? "bg-[#F3EAF5] font-medium text-[#946D6D]"
                : "text-[#8F8585] hover:bg-[#FAF6F6]"
            }`}
          >
            All Gifts
          </button>

          {/* Categories */}
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleCategoryChange(item)}
              className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                category === item
                  ? "bg-[#F3EAF5] font-medium text-[#946D6D]"
                  : "text-[#8F8585] hover:bg-[#FAF6F6]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

export default CategorySidebar;

