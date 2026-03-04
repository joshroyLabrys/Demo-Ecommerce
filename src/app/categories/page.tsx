"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/data";

const priceRanges = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-250", label: "$100 – $250", min: 100, max: 250 },
  { id: "over-250", label: "Over $250", min: 250, max: Infinity },
];

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
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");

  const filteredProducts = useMemo(() => {
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

    const priceRange = priceRanges.find((r) => r.id === selectedPrice);
    if (priceRange && selectedPrice !== "all") {
      result = result.filter((p) => p.price >= priceRange.min && p.price < priceRange.max);
    }

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
  }, [searchQuery, selectedCategory, selectedPrice, selectedSort]);

  const activeFilters = [];
  if (selectedCategory !== "all") {
    const cat = categories.find((c) => c.slug === selectedCategory);
    if (cat) activeFilters.push({ type: "category", label: cat.name });
  }
  if (selectedPrice !== "all") {
    const pr = priceRanges.find((r) => r.id === selectedPrice);
    if (pr) activeFilters.push({ type: "price", label: pr.label });
  }
  if (searchQuery) activeFilters.push({ type: "search", label: `"${searchQuery}"` });

  const clearFilter = (type: string) => {
    if (type === "category") setSelectedCategory("all");
    if (type === "price") setSelectedPrice("all");
    if (type === "search") setSearchQuery("");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="border-b border-border/30 bg-gradient-to-b from-stone-100 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-700">Browse</p>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our full collection of {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Category Grid */}
      <div className="mb-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "all" : cat.slug)}
            className={`group relative aspect-[4/3] overflow-hidden rounded-xl transition-all shadow-sm ${
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
            <span className="absolute bottom-2.5 left-2.5 text-xs font-semibold text-white">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                {priceRanges.find((r) => r.id === selectedPrice)?.label}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {priceRanges.map((range) => (
                <DropdownMenuItem
                  key={range.id}
                  onClick={() => setSelectedPrice(range.id)}
                  className={selectedPrice === range.id ? "bg-accent" : ""}
                >
                  {range.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Active Filters */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <AnimatePresence mode="popLayout">
                {activeFilters.map((filter) => (
                  <motion.div
                    key={filter.type}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Badge variant="secondary" className="gap-1 rounded-full">
                      {filter.label}
                      <button onClick={() => clearFilter(filter.type)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto rounded-full px-2 py-1 text-xs"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedPrice("all");
                  setSearchQuery("");
                }}
              >
                Clear all
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            key={`${selectedCategory}-${selectedPrice}-${selectedSort}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
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
              onClick={() => {
                setSelectedCategory("all");
                setSelectedPrice("all");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
