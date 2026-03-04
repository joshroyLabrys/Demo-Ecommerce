"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Star, X } from "lucide-react";
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

/* ------------------------------------------------------------------ */
/*  ActiveFilterBadges – rendered in the toolbar, not the sidebar     */
/* ------------------------------------------------------------------ */

interface ActiveFilterBadgesProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  className?: string;
}

export function ActiveFilterBadges({
  filters,
  onChange,
  className,
}: ActiveFilterBadgesProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeCount = getActiveFilterCount(filters);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) {
      setOverflows(false);
      return;
    }
    const rowHeight = firstChild.offsetHeight + 8;
    setOverflows(el.scrollHeight > rowHeight);
  }, [activeCount]);

  useEffect(() => {
    if (!overflows) setExpanded(false);
  }, [overflows]);

  if (activeCount === 0) return null;

  const removeBrand = (b: string) =>
    onChange({ ...filters, brands: filters.brands.filter((x) => x !== b) });
  const removePriceRange = (id: string) =>
    onChange({
      ...filters,
      priceRanges: filters.priceRanges.filter((x) => x !== id),
    });
  const removeColor = (c: string) =>
    onChange({ ...filters, colors: filters.colors.filter((x) => x !== c) });
  const removeSize = (s: string) =>
    onChange({ ...filters, sizes: filters.sizes.filter((x) => x !== s) });

  return (
    <div className={cn("flex items-start gap-2", className)}>
      <motion.div
        initial={false}
        animate={{ height: expanded || !overflows ? "auto" : 32 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 overflow-hidden"
      >
        <div ref={contentRef} className="flex flex-wrap gap-1.5">
          {filters.brands.map((b) => (
            <Badge
              key={`b-${b}`}
              variant="secondary"
              className="gap-1 rounded-full text-[11px]"
            >
              {b}
              <button onClick={() => removeBrand(b)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.priceRanges.map((id) => {
            const r = PRICE_RANGES.find((pr) => pr.id === id);
            return (
              <Badge
                key={`p-${id}`}
                variant="secondary"
                className="gap-1 rounded-full text-[11px]"
              >
                {r?.label}
                <button onClick={() => removePriceRange(id)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {filters.colors.map((c) => (
            <Badge
              key={`c-${c}`}
              variant="secondary"
              className="gap-1 rounded-full text-[11px]"
            >
              {c}
              <button onClick={() => removeColor(c)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.sizes.map((s) => (
            <Badge
              key={`s-${s}`}
              variant="secondary"
              className="gap-1 rounded-full text-[11px]"
            >
              {s}
              <button onClick={() => removeSize(s)}>
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
              <button onClick={() => onChange({ ...filters, minRating: 0 })}>
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
          <Button
            variant="ghost"
            size="sm"
            className="h-auto rounded-full px-2 py-0.5 text-[11px] text-muted-foreground"
            onClick={() => onChange(emptyFilters)}
          >
            Clear all
          </Button>
        </div>
      </motion.div>
      {overflows && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 px-2 text-xs text-muted-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Less <ChevronUp className="ml-0.5 h-3 w-3" />
            </>
          ) : (
            <>
              More <ChevronDown className="ml-0.5 h-3 w-3" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FilterSection – controlled collapsible with smart accordion       */
/* ------------------------------------------------------------------ */

function FilterSection({
  title,
  sectionKey,
  expandedSection,
  onToggle,
  hasActiveFilters,
  activeCount,
  children,
  activeChildren,
}: {
  title: string;
  sectionKey: string;
  expandedSection: string | null;
  onToggle: (key: string) => void;
  hasActiveFilters: boolean;
  activeCount?: number;
  children: React.ReactNode;
  activeChildren?: React.ReactNode;
}) {
  const isExpanded = expandedSection === sectionKey;
  const showContent = isExpanded || hasActiveFilters;

  return (
    <div className="border-b border-border/40 py-4">
      <button
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
      >
        <span className="flex items-center gap-2">
          {title}
          {hasActiveFilters &&
            !isExpanded &&
            activeCount != null &&
            activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                {activeCount}
              </span>
            )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {showContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {isExpanded ? children : activeChildren}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FilterPanel                                                        */
/* ------------------------------------------------------------------ */

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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

  const handleToggle = (key: string) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  return (
    <div className={cn("flex flex-col", className)}>
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

      {availableOptions.brands.length > 1 && (
        <FilterSection
          title="Brand"
          sectionKey="brand"
          expandedSection={expandedSection}
          onToggle={handleToggle}
          hasActiveFilters={filters.brands.length > 0}
          activeCount={filters.brands.length}
          activeChildren={filters.brands.map((brand) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox checked onCheckedChange={() => toggleBrand(brand)} />
              <span className="flex-1 text-sm text-foreground/80">{brand}</span>
            </label>
          ))}
        >
          {availableOptions.brands.map(([brand, count]) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span className="flex-1 text-sm text-foreground/80">{brand}</span>
              <span className="text-xs text-muted-foreground">{count}</span>
            </label>
          ))}
        </FilterSection>
      )}

      <FilterSection
        title="Price"
        sectionKey="price"
        expandedSection={expandedSection}
        onToggle={handleToggle}
        hasActiveFilters={filters.priceRanges.length > 0}
        activeCount={filters.priceRanges.length}
        activeChildren={filters.priceRanges.map((id) => {
          const range = PRICE_RANGES.find((r) => r.id === id);
          return (
            <label
              key={id}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox checked onCheckedChange={() => togglePriceRange(id)} />
              <span className="flex-1 text-sm text-foreground/80">
                {range?.label}
              </span>
            </label>
          );
        })}
      >
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
      </FilterSection>

      {availableOptions.colors.length > 0 && (
        <FilterSection
          title="Color"
          sectionKey="color"
          expandedSection={expandedSection}
          onToggle={handleToggle}
          hasActiveFilters={filters.colors.length > 0}
          activeCount={filters.colors.length}
          activeChildren={
            <div className="flex flex-wrap gap-2">
              {availableOptions.colors
                .filter((c) => filters.colors.includes(c.name))
                .map((color) => (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className="group flex flex-col items-center gap-1"
                    title={color.name}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground shadow-sm">
                      <span
                        className="h-5 w-5 rounded-full border border-black/10"
                        style={{ backgroundColor: color.value }}
                      />
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {color.name}
                    </span>
                  </button>
                ))}
            </div>
          }
        >
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
        </FilterSection>
      )}

      {availableOptions.sizes.length > 0 && (
        <FilterSection
          title="Size"
          sectionKey="size"
          expandedSection={expandedSection}
          onToggle={handleToggle}
          hasActiveFilters={filters.sizes.length > 0}
          activeCount={filters.sizes.length}
          activeChildren={
            <div className="flex flex-wrap gap-1.5">
              {filters.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className="rounded-lg border border-foreground bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-all"
                >
                  {size}
                </button>
              ))}
            </div>
          }
        >
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
        </FilterSection>
      )}

      <FilterSection
        title="Rating"
        sectionKey="rating"
        expandedSection={expandedSection}
        onToggle={handleToggle}
        hasActiveFilters={filters.minRating > 0}
        activeCount={filters.minRating > 0 ? 1 : 0}
        activeChildren={
          filters.minRating > 0 ? (
            <div className="space-y-1.5">
              <button
                onClick={() => setRating(filters.minRating)}
                className="flex w-full items-center gap-2 rounded-lg bg-amber-50 px-2 py-1.5 text-sm text-foreground"
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < filters.minRating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-neutral-200 text-neutral-200"
                      )}
                    />
                  ))}
                </div>
                <span>& up</span>
              </button>
            </div>
          ) : undefined
        }
      >
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
      </FilterSection>

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
