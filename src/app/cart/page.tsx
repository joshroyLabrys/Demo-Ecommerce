"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, itemCount, subtotal, shipping, tax, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Add some items to get started</p>
        <Link href="/categories">
          <Button className="mt-6 gap-2 rounded-full px-8">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="mt-2 text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Card className="overflow-hidden rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-4 sm:gap-6">
                      <Link href={`/products/${item.product.id}`} className="shrink-0">
                        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-neutral-100 sm:h-32 sm:w-32">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              {item.product.brand}
                            </p>
                            <Link
                              href={`/products/${item.product.id}`}
                              className="mt-0.5 text-sm font-medium hover:underline sm:text-base"
                            >
                              {item.product.name}
                            </Link>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {[item.selectedColor, item.selectedSize].filter(Boolean).join(" · ")}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-red-500"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 1.3, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.15 }}
                              className="w-8 text-center text-sm font-medium"
                            >
                              {item.quantity}
                            </motion.span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <motion.p
                              key={item.product.price * item.quantity}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-sm font-semibold"
                            >
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </motion.p>
                            {item.product.originalPrice > item.product.price && (
                              <p className="text-xs text-muted-foreground line-through">
                                ${(item.product.originalPrice * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              {subtotal < 200 && (
                <p className="text-xs text-muted-foreground">
                  Add ${(200 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="block">
                <Button className="w-full gap-2 rounded-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                Secure checkout with SSL encryption
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders over $200</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">Your data is protected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/categories" className="block">
            <Button variant="outline" className="w-full gap-2 rounded-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
