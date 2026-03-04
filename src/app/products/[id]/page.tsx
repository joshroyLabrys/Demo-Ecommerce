"use client";

import { use, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  ThumbsUp,
  MessageCircle,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { AnimatedSection, StaggerGrid, StaggerItem } from "@/components/animated-section";
import { useCart } from "@/contexts/cart-context";
import {
  getProductById,
  getReviewsForProduct,
  getProductsByCategory,
  reviews as allReviews,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const productReviews = getReviewsForProduct(id);
  const displayReviews = productReviews.length > 0 ? productReviews : allReviews.slice(0, 3);
  const relatedProducts = getProductsByCategory(product.categorySlug).filter(
    (p) => p.id !== product.id
  );

  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor?.name);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/categories" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-foreground">
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
            {product.isNew && (
              <Badge className="absolute left-4 top-4 rounded-full bg-foreground text-background">
                NEW
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="absolute left-4 top-12 rounded-full bg-red-500 text-white">
                -{discount}%
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all",
                    selectedImage === i
                      ? "border-foreground"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-neutral-200 text-neutral-200"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <Badge variant="secondary" className="rounded-full text-red-600">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.longDescription}
          </p>

          <Separator className="my-6" />

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium">
                Color: {selectedColor?.name}
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-all",
                      selectedColor?.name === color.name
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105",
                      color.value === "#FFFFFF" && "border border-neutral-200"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className="min-w-[3rem] rounded-full"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mt-auto flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center rounded-full border">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <motion.span
                key={quantity}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="w-12 text-center text-sm font-medium"
              >
                {quantity}
              </motion.span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2 rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <motion.div
                animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isWishlisted && "fill-red-500 text-red-500"
                  )}
                />
              </motion.div>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1 rounded-xl bg-neutral-50 p-3 text-center">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-neutral-50 p-3 text-center">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">2-Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl bg-neutral-50 p-3 text-center">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <AnimatedSection className="mt-20">
        <h2 className="mb-8 text-2xl font-bold tracking-tight">Customer Reviews</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {displayReviews.map((review) => (
              <Card key={review.id} className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-neutral-200 text-neutral-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {review.content}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {review.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {review.comments}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Review Form */}
          <Card className="h-fit rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Write a Review</CardTitle>
              <CardDescription>Share your experience with this product</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  toast.success("Thank you! Your review has been submitted.");
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" className="mt-1.5 rounded-lg" />
                </div>
                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Tell us about your experience..."
                    className="mt-1.5 min-h-[100px] rounded-lg"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full">
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <AnimatedSection className="mt-20">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">You Might Also Like</h2>
          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </AnimatedSection>
      )}
    </div>
  );
}
