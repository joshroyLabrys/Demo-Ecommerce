"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import {
  FilterPanel,
  ActiveFilterBadges,
  emptyFilters,
  applyFilters,
  getActiveFilterCount,
  type Filters,
} from "@/components/filter-panel";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { notFound } from "next/navigation";

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = getCategoryBySlug(slug);
  const [selectedSort, setSelectedSort] = useState("featured");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  if (!category) {
    notFound();
  }

  const allProducts = getProductsByCategory(slug);

  const sortedProducts = useMemo(() => {
    const result = applyFilters(allProducts, filters);

    switch (selectedSort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [allProducts, filters, selectedSort]);

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div>
      {/* Page Header */}
      <div className="border-b border-border/30 bg-gradient-to-b from-stone-100 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/categories" className="transition-colors hover:text-foreground">
              Shop
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{category.name}</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
            </p>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto rounded-full px-2 py-1 text-xs text-muted-foreground"
                onClick={() => setFilters(emptyFilters)}
              >
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {/* Mobile filter toggle */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-full lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-0.5 h-5 w-5 rounded-full bg-foreground p-0 text-[10px] text-background">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto border-r border-border/30 bg-white p-6">
                <SheetTitle className="sr-only">Product Filters</SheetTitle>
                <FilterPanel
                  products={allProducts}
                  filters={filters}
                  onChange={setFilters}
                />
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                  Sort: {sortOptions.find((s) => s.id === selectedSort)?.label}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setSelectedSort(option.id)}
                    className={selectedSort === option.id ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active filter badges */}
        <AnimatePresence initial={false}>
          {activeFilterCount > 0 && (
            <motion.div
              key="filter-badges"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <ActiveFilterBadges
                filters={filters}
                onChange={setFilters}
                className="mb-4"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content: Sidebar + Grid */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-24">
              <FilterPanel
                products={allProducts}
                filters={filters}
                onChange={setFilters}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="min-w-0 flex-1">
            {sortedProducts.length > 0 ? (
              <motion.div
                key={`${selectedSort}-${JSON.stringify(filters)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.04,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <SlidersHorizontal className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-lg font-medium">No products match</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-full"
                  onClick={() => setFilters(emptyFilters)}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
