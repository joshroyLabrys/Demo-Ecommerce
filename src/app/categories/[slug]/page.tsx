"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCard } from "@/components/product-card";
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

  if (!category) {
    notFound();
  }

  const allProducts = getProductsByCategory(slug);

  const sortedProducts = useMemo(() => {
    const result = [...allProducts];
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
  }, [allProducts, selectedSort]);

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
      {/* Sort */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
        </p>
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

      {/* Product Grid */}
      <motion.div
        key={selectedSort}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
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
      </div>
    </div>
  );
}
