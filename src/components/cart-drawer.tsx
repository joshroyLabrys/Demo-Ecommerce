"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    shipping,
    total,
  } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md"
        showCloseButton
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-bold text-background">
                {itemCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Your cart is empty
            </p>
            <SheetTrigger asChild>
              <Link href="/categories">
                <Button variant="outline" className="gap-2 rounded-full">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </SheetTrigger>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-border/30 py-4 last:border-b-0"
                  >
                    <div className="flex gap-3">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="shrink-0"
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-neutral-100">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              {item.product.brand}
                            </p>
                            <Link
                              href={`/products/${item.product.id}`}
                              className="line-clamp-1 text-sm font-medium hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="text-[11px] text-muted-foreground">
                                {[item.selectedColor, item.selectedSize]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-red-500"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center rounded-full border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            {item.product.originalPrice > item.product.price && (
                              <p className="text-[11px] text-muted-foreground line-through">
                                $
                                {(
                                  item.product.originalPrice * item.quantity
                                ).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <SheetTrigger asChild>
                    <Link href="/checkout" className="block">
                      <Button className="w-full gap-2 rounded-full" size="lg">
                        Checkout
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </SheetTrigger>
                  <SheetTrigger asChild>
                    <Link href="/cart" className="block">
                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                        size="sm"
                      >
                        View Full Cart
                      </Button>
                    </Link>
                  </SheetTrigger>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
