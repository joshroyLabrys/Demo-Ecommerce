"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

const WISHLIST_KEY = "meridian-wishlist";

function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setIsWishlisted(getWishlist().includes(product.id));
  }, [product.id]);

  const toggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const wishlist = getWishlist();
      if (isWishlisted) {
        const updated = wishlist.filter((id) => id !== product.id);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
        setIsWishlisted(false);
        toast.success(`Removed from wishlist`);
      } else {
        wishlist.push(product.id);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        setIsWishlisted(true);
        toast.success(`Added to wishlist`);
      }
    },
    [isWishlisted, product.id]
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    setTimeout(() => {
      addItem(product, quantity);
      setIsAdding(false);
      toast.success(`${product.name} added to cart`, {
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      });
      setQuantity(1);
    }, 350);
  };

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn("group block", className)}
    >
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/8">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Top-left: NEW badge */}
          {product.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md shadow-emerald-600/30">
              New
            </span>
          )}

          {/* Top-right: Wishlist heart — always visible */}
          <button
            onClick={toggleWishlist}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
              isWishlisted
                ? "bg-rose-50 shadow-md"
                : "bg-white/70 shadow-sm backdrop-blur-sm hover:bg-white hover:shadow-md"
            )}
          >
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-colors",
                isWishlisted
                  ? "fill-rose-500 text-rose-500"
                  : "text-neutral-600"
              )}
            />
          </button>

          {/* Bottom-left: Discount badge — large and prominent */}
          {discount > 0 && (
            <span className="absolute bottom-3 left-3 rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            {product.brand}
          </p>
          <h3 className="mt-1 text-sm font-medium leading-snug text-foreground line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-neutral-200 text-neutral-200"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground/60 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center overflow-hidden rounded-full border border-border/80 bg-neutral-50">
              <button
                onClick={(e) => handleQuantityChange(e, -1)}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="flex h-8 w-6 items-center justify-center text-sm font-medium tabular-nums">
                {quantity}
              </span>
              <button
                onClick={(e) => handleQuantityChange(e, 1)}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="h-8 flex-1 gap-1.5 rounded-full text-xs font-semibold"
            >
              {isAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
