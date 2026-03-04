"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Star, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data";

export interface Filters {
  brands: string[];
  priceRanges: string[];
  colors: string[];
  sizes: string[];
  minRating: number;
  onSale: boolean;
}

export const emptyFilters: Filters = {
  brands: [],
  priceRanges: [],
  colors: [],
  sizes: [],
  minRating: 0,
  onSale: false,
};

export const PRICE_RANGES = [
  { id: "under-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-250", label: "$100 – $250", min: 100, max: 250 },
  { id: "250-500", label: "$250 – $500", min: 250, max: 500 },
  { id: "over-500", label: "Over $500", min: 500, max: Infinity },
];

export function getActiveFilterCount(filters: Filters): number {
  return (
    filters.brands.length +
    filters.priceRanges.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.onSale ? 1 : 0)
  );
}

export function applyFilters(products: Product[], filters: Filters): Product[] {
  let result = [...products];

  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  if (filters.priceRanges.length > 0) {
    const ranges = PRICE_RANGES.filter((r) =>
      filters.priceRanges.includes(r.id)
    );
    result = result.filter((p) =>
      ranges.some((r) => p.price >= r.min && p.price < r.max)
    );
  }

  if (filters.colors.length > 0) {
    result = result.filter(
      (p) => p.colors && p.colors.some((c) => filters.colors.includes(c.name))
    );
  }

  if (filters.sizes.length > 0) {
    result = result.filter(
      (p) => p.sizes && p.sizes.some((s) => filters.sizes.includes(s))
    );
  }

  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  if (filters.onSale) {
    result = result.filter((p) => p.originalPrice > p.price);
  }

  return result;
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

interface FilterPanelProps {
  products: Product[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  className?: string;
}

export function FilterPanel({
  products,
  filters,
  onChange,
  className,
}: FilterPanelProps) {
  const availableOptions = useMemo(() => {
    const brands = new Map<string, number>();
    const colors = new Map<string, { name: string; value: string }>();
    const sizes = new Set<string>();
    const priceRangeCounts = new Map<string, number>();
    let onSaleCount = 0;

    products.forEach((p) => {
      brands.set(p.brand, (brands.get(p.brand) || 0) + 1);
      p.colors?.forEach((c) => colors.set(c.name, c));
      p.sizes?.forEach((s) => sizes.add(s));
      if (p.originalPrice > p.price) onSaleCount++;
      PRICE_RANGES.forEach((r) => {
        if (p.price >= r.min && p.price < r.max) {
          priceRangeCounts.set(r.id, (priceRangeCounts.get(r.id) || 0) + 1);
        }
      });
    });

    const sortedBrands = [...brands.entries()].sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    const sortedColors = [...colors.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
    const sortedSizes = [...sizes].sort((a, b) => {
      const ia = sizeOrder.indexOf(a);
      const ib = sizeOrder.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      const na = parseFloat(a);
      const nb = parseFloat(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });

    return {
      brands: sortedBrands,
      colors: sortedColors,
      sizes: sortedSizes,
      priceRangeCounts,
      onSaleCount,
    };
  }, [products]);

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  const togglePriceRange = (id: string) => {
    const next = filters.priceRanges.includes(id)
      ? filters.priceRanges.filter((r) => r !== id)
      : [...filters.priceRanges, id];
    onChange({ ...filters, priceRanges: next });
  };

  const toggleColor = (color: string) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors: next });
  };

  const toggleSize = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: next });
  };

  const setRating = (rating: number) => {
    onChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  };

  const activeCount = getActiveFilterCount(filters);

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Filters
        </h3>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto rounded-full px-2 py-1 text-xs text-muted-foreground"
            onClick={() => onChange(emptyFilters)}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-border/40 pb-4">
          {filters.brands.map((b) => (
            <Badge
              key={b}
              variant="secondary"
              className="gap-1 rounded-full text-[11px]"
            >
              {b}
              <button onClick={() => toggleBrand(b)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.priceRanges.map((id) => {
            const r = PRICE_RANGES.find((pr) => pr.id === id);
            return (
              <Badge
                key={id}
                variant="secondary"
                className="gap-1 rounded-full text-[11px]"
              >
                {r?.label}
                <button onClick={() => togglePriceRange(id)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {filters.colors.map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="gap-1 rounded-full text-[11px]"
            >
              {c}
              <button onClick={() => toggleColor(c)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.sizes.map((s) => (
            <Badge
              key={s}
              variant="secondary"
              className="gap-1 rounded-full text-[11px]"
            >
              {s}
              <button onClick={() => toggleSize(s)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.minRating > 0 && (
            <Badge
              variant="secondary"
              className="gap-1 rounded-full text-[11px]"
            >
              {filters.minRating}+ stars
              <button onClick={() => setRating(0)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.onSale && (
            <Badge
              variant="secondary"
              className="gap-1 rounded-full text-[11px]"
            >
              On Sale
              <button onClick={() => onChange({ ...filters, onSale: false })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Brand */}
      {availableOptions.brands.length > 1 && (
        <CollapsibleSection title="Brand">
          {availableOptions.brands.map(([brand, count]) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span className="flex-1 text-sm text-foreground/80">
                {brand}
              </span>
              <span className="text-xs text-muted-foreground">{count}</span>
            </label>
          ))}
        </CollapsibleSection>
      )}

      {/* Price Range */}
      <CollapsibleSection title="Price">
        {PRICE_RANGES.map((range) => {
          const count = availableOptions.priceRangeCounts.get(range.id) || 0;
          if (count === 0) return null;
          return (
            <label
              key={range.id}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.priceRanges.includes(range.id)}
                onCheckedChange={() => togglePriceRange(range.id)}
              />
              <span className="flex-1 text-sm text-foreground/80">
                {range.label}
              </span>
              <span className="text-xs text-muted-foreground">{count}</span>
            </label>
          );
        })}
      </CollapsibleSection>

      {/* Color */}
      {availableOptions.colors.length > 0 && (
        <CollapsibleSection title="Color">
          <div className="flex flex-wrap gap-2">
            {availableOptions.colors.map((color) => {
              const selected = filters.colors.includes(color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className="group flex flex-col items-center gap-1"
                  title={color.name}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all",
                      selected
                        ? "border-foreground shadow-sm"
                        : "border-transparent hover:border-foreground/30"
                    )}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{ backgroundColor: color.value }}
                    />
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {color.name}
                  </span>
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Size */}
      {availableOptions.sizes.length > 0 && (
        <CollapsibleSection title="Size">
          <div className="flex flex-wrap gap-1.5">
            {availableOptions.sizes.map((size) => {
              const selected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-white text-foreground/70 hover:border-foreground/40"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Rating */}
      <CollapsibleSection title="Rating" defaultOpen={false}>
        <div className="space-y-1.5">
          {[4, 3, 2].map((rating) => (
            <button
              key={rating}
              onClick={() => setRating(rating)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                filters.minRating === rating
                  ? "bg-amber-50 text-foreground"
                  : "text-foreground/70 hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-neutral-200 text-neutral-200"
                    )}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* On Sale */}
      {availableOptions.onSaleCount > 0 && (
        <div className="py-4">
          <label className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              checked={filters.onSale}
              onCheckedChange={(checked) =>
                onChange({ ...filters, onSale: checked === true })
              }
            />
            <span className="flex-1 text-sm font-medium text-foreground/80">
              On Sale
            </span>
            <Badge
              variant="secondary"
              className="rounded-full text-[10px] font-semibold text-rose-600"
            >
              {availableOptions.onSaleCount}
            </Badge>
          </label>
        </div>
      )}
    </div>
  );
}
