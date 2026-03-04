"use client";

import { use, useState, useMemo, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ChevronRight,
  ChevronLeft,
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
  X,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [reviewSort, setReviewSort] = useState<string>("newest");

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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    displayReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++;
    });
    const total = displayReviews.length;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: dist[star - 1],
      percentage: total > 0 ? (dist[star - 1] / total) * 100 : 0,
    }));
  }, [displayReviews]);

  const filteredReviews = useMemo(() => {
    let filtered = [...displayReviews];
    if (ratingFilter !== "all") {
      const starVal = parseInt(ratingFilter);
      filtered = filtered.filter((r) => r.rating === starVal);
    }
    if (reviewSort === "highest") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (reviewSort === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (reviewSort === "helpful") {
      filtered.sort((a, b) => b.likes - a.likes);
    }
    return filtered;
  }, [displayReviews, ratingFilter, reviewSort]);

  const avgRating = useMemo(() => {
    if (displayReviews.length === 0) return 0;
    return displayReviews.reduce((s, r) => s + r.rating, 0) / displayReviews.length;
  }, [displayReviews]);

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
          <div
            className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-neutral-100"
            onClick={() => openLightbox(selectedImage)}
          >
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
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5" />
              Click to zoom
            </div>
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

      {/* Product Tabs: Description / Specifications / Reviews */}
      <AnimatedSection className="mt-20">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="mb-8 w-full justify-start rounded-full border bg-transparent p-1">
            <TabsTrigger value="description" className="rounded-full px-6 data-[state=active]:bg-foreground data-[state=active]:text-background">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="rounded-full px-6 data-[state=active]:bg-foreground data-[state=active]:text-background">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-full px-6 data-[state=active]:bg-foreground data-[state=active]:text-background">
              Reviews ({displayReviews.length})
            </TabsTrigger>
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description">
            <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="mb-4 text-lg font-semibold">About this product</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {product.longDescription}
                </p>
                <Separator className="my-6" />
                <h4 className="mb-3 text-sm font-semibold">Highlights</h4>
                <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    Designed for everyday use
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    Backed by 2-year warranty
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    Eco-friendly packaging
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specifications">
            <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="mb-4 text-lg font-semibold">Product Specifications</h3>
                <div className="divide-y">
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  {product.sizes && (
                    <div className="flex justify-between py-3 text-sm">
                      <span className="text-muted-foreground">Available Sizes</span>
                      <span className="font-medium">{product.sizes.join(", ")}</span>
                    </div>
                  )}
                  {product.colors && (
                    <div className="flex justify-between py-3 text-sm">
                      <span className="text-muted-foreground">Available Colors</span>
                      <span className="font-medium">{product.colors.map((c) => c.name).join(", ")}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="font-medium">{product.id.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Availability</span>
                    <Badge variant="secondary" className={cn("rounded-full", product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">{product.rating} / 5 ({product.reviewCount} reviews)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Rating Distribution */}
                <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      <div className="text-center sm:text-left">
                        <p className="text-5xl font-bold">{avgRating.toFixed(1)}</p>
                        <div className="mt-1 flex items-center justify-center gap-0.5 sm:justify-start">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.round(avgRating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-neutral-200 text-neutral-200"
                              )}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {displayReviews.length} reviews
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {ratingDistribution.map(({ star, count, percentage }) => (
                          <button
                            key={star}
                            className="flex w-full items-center gap-2 text-sm hover:opacity-80"
                            onClick={() => setRatingFilter(ratingFilter === String(star) ? "all" : String(star))}
                          >
                            <span className="w-4 text-right font-medium">{star}</span>
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <Progress value={percentage} className="h-2 flex-1" />
                            <span className="w-8 text-right text-xs text-muted-foreground">
                              {count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Filters */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger className="w-[140px] rounded-full text-sm">
                        <SelectValue placeholder="All ratings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All ratings</SelectItem>
                        <SelectItem value="5">5 stars</SelectItem>
                        <SelectItem value="4">4 stars</SelectItem>
                        <SelectItem value="3">3 stars</SelectItem>
                        <SelectItem value="2">2 stars</SelectItem>
                        <SelectItem value="1">1 star</SelectItem>
                      </SelectContent>
                    </Select>
                    {ratingFilter !== "all" && (
                      <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setRatingFilter("all")}>
                        Clear
                      </Button>
                    )}
                  </div>
                  <Select value={reviewSort} onValueChange={setReviewSort}>
                    <SelectTrigger className="w-[140px] rounded-full text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="highest">Highest rated</SelectItem>
                      <SelectItem value="lowest">Lowest rated</SelectItem>
                      <SelectItem value="helpful">Most helpful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reviews List */}
                {filteredReviews.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>No reviews match the selected filter.</p>
                    <Button variant="ghost" className="mt-2 rounded-full" onClick={() => setRatingFilter("all")}>
                      Show all reviews
                    </Button>
                  </div>
                ) : (
                  filteredReviews.map((review) => (
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
                  ))
                )}
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
                      if (reviewRating === 0) {
                        toast.error("Please select a rating");
                        return;
                      }
                      toast.success("Thank you! Your review has been submitted.");
                      setReviewRating(0);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label>Your Rating</Label>
                      <div className="mt-1.5 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onMouseEnter={() => setReviewHover(i + 1)}
                            onMouseLeave={() => setReviewHover(0)}
                            onClick={() => setReviewRating(i + 1)}
                            className="p-0.5"
                          >
                            <Star
                              className={cn(
                                "h-6 w-6 transition-colors",
                                (reviewHover || reviewRating) > i
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-neutral-200 text-neutral-200 hover:fill-amber-200 hover:text-amber-200"
                              )}
                            />
                          </button>
                        ))}
                        {reviewRating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {reviewRating}/5
                          </span>
                        )}
                      </div>
                    </div>
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
          </TabsContent>
        </Tabs>
      </AnimatedSection>

      {/* Fullscreen Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl border-none bg-black/95 p-0 sm:rounded-2xl">
          <DialogTitle className="sr-only">Product image gallery</DialogTitle>
          <div className="relative flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 z-10 rounded-full text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 z-10 rounded-full text-white hover:bg-white/20"
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + product.images.length) % product.images.length
                    )
                  }
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 z-10 rounded-full text-white hover:bg-white/20 top-1/2 -translate-y-1/2"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % product.images.length)
                  }
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            <div className="relative aspect-square w-full max-h-[80vh]">
              <Image
                src={product.images[lightboxIndex]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      lightboxIndex === i ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
