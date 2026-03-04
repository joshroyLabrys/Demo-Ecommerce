"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  emptyFilters,
  applyFilters,
  getActiveFilterCount,
  type Filters,
} from "@/components/filter-panel";
import { categories, products } from "@/lib/data";

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const baseProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = applyFilters(baseProducts, filters);

    switch (selectedSort) {
      case "newest":
        result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
        break;
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
  }, [baseProducts, filters, selectedSort]);

  const activeFilterCount = getActiveFilterCount(filters);

  const clearAll = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setFilters(emptyFilters);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="border-b border-border/30 bg-gradient-to-b from-stone-100 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-700">Browse</p>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full collection of {products.length} products
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Grid */}
        <div className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "all" : cat.slug)}
              className={`group relative aspect-[4/3] overflow-hidden rounded-xl shadow-sm transition-all ${
                selectedCategory === cat.slug
                  ? "ring-2 ring-foreground ring-offset-2 shadow-md"
                  : "hover:ring-2 hover:ring-foreground/20 hover:shadow-md"
              }`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-semibold text-white">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Toolbar: Search + Sort + Mobile Filter Toggle */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full pl-10"
            />
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
                  products={baseProducts}
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

        {/* Result count + active info */}
        <div className="mb-6 flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            {selectedCategory !== "all" && (
              <> in <span className="font-medium text-foreground">{categories.find(c => c.slug === selectedCategory)?.name}</span></>
            )}
          </p>
          {(activeFilterCount > 0 || selectedCategory !== "all" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto rounded-full px-2 py-1 text-xs text-muted-foreground"
              onClick={clearAll}
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Main content: Sidebar + Grid */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-24">
              <FilterPanel
                products={baseProducts}
                filters={filters}
                onChange={setFilters}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key={`${selectedCategory}-${selectedSort}-${searchQuery}-${JSON.stringify(filters)}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(index * 0.03, 0.3),
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <SlidersHorizontal className="mb-4 h-12 w-12 text-muted-foreground/40" />
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-full"
                    onClick={clearAll}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
