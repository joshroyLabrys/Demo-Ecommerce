"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { AnimatedSection, StaggerGrid, StaggerItem } from "@/components/animated-section";
import { categories, getFeaturedProducts, getNewProducts } from "@/lib/data";
import { PromoBannerOne } from "@/components/promo-banner-01";

const featuredProducts = getFeaturedProducts();
const newProducts = getNewProducts();

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Promo Banner */}
      <PromoBannerOne />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-amber-50/30 to-background py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection className="max-w-xl">
              <Badge variant="secondary" className="mb-6 rounded-full border border-amber-200/60 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800">
                Spring Collection 2026
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Curated for the{" "}
                <span className="bg-gradient-to-r from-stone-900 via-amber-900 to-stone-600 bg-clip-text text-transparent">
                  Modern Life
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Discover our handpicked collection of premium electronics, fashion,
                home goods, and wellness essentials. Designed for those who appreciate
                quality and intention.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/categories">
                  <Button size="lg" className="gap-2 rounded-full px-8">
                    <ShoppingBag className="h-4 w-4" />
                    Shop Now
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button size="lg" variant="outline" className="gap-2 rounded-full px-8">
                    Explore Collections
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-neutral-200">
                      <Image
                        src={`https://notion-avatars.netlify.app/api/avatar?preset=${i % 2 === 0 ? "female" : "male"}-${Math.ceil(i / 2)}`}
                        alt=""
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 text-sm font-medium">4.9</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Trusted by 10,000+ customers</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"
                      alt="Premium Headphones"
                      width={400}
                      height={500}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"
                      alt="Smart Watch"
                      width={400}
                      height={300}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=80"
                      alt="Leather Bag"
                      width={400}
                      height={300}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&auto=format&fit=crop&q=80"
                      alt="Candles"
                      width={400}
                      height={500}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border/30 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-700">Collections</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Shop by Category</h2>
              <p className="mt-2 text-muted-foreground">Browse our curated collections</p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" className="gap-1.5 rounded-full">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
          <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl block"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {cat.trending && (
                    <Badge className="absolute top-3 left-3 rounded-full bg-amber-500 text-white text-[10px] px-2 py-0.5 border-0">
                      Trending
                    </Badge>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                    <p className="mt-0.5 text-xs text-white/70">{cat.productCount} products</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rose-600">Trending</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">Our most loved selections</p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" className="gap-1.5 rounded-full">
                Shop All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="border-y border-border/30 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-700">Just Dropped</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">New Arrivals</h2>
              <p className="mt-2 text-muted-foreground">The latest additions to our collection</p>
            </div>
          </AnimatedSection>
          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StaggerItem>
              <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">On orders over $200</p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Checkout</h3>
                  <p className="text-sm text-muted-foreground">SSL encrypted payments</p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">30-Day Returns</h3>
                  <p className="text-sm text-muted-foreground">Hassle-free return policy</p>
                </div>
              </div>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
