"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/lib/data";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

const PROMO_CODES: Record<string, { type: "percent" | "fixed" | "freeship"; value: number; label: string }> = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  WELCOME20: { type: "percent", value: 20, label: "20% off" },
  FREESHIP: { type: "freeship", value: 0, label: "Free shipping" },
};

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode: string | null;
  promoDiscount: number;
  promoLabel: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  shippingMethod: "standard" | "express" | "overnight";
  setShippingMethod: (method: "standard" | "express" | "overnight") => void;
  shippingCost: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "meridian-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "overnight">("standard");

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {}
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = useCallback(
    (product: Product, quantity = 1, size?: string, color?: string) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
    setShippingMethod("standard");
  }, []);

  const applyPromoCode = useCallback((code: string): boolean => {
    const upper = code.toUpperCase().trim();
    if (PROMO_CODES[upper]) {
      setPromoCode(upper);
      return true;
    }
    return false;
  }, []);

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const shippingRates = { standard: 0, express: 15.99, overnight: 29.99 };
  const baseShipping = subtotal >= 200 ? 0 : shippingRates[shippingMethod] || 15.99;
  const promo = promoCode ? PROMO_CODES[promoCode] : null;
  const isFreeShipPromo = promo?.type === "freeship";
  const shippingCost = isFreeShipPromo ? 0 : (shippingMethod === "standard" ? baseShipping : shippingRates[shippingMethod]);
  const shipping = shippingCost;

  const promoDiscount = promo
    ? promo.type === "percent"
      ? subtotal * (promo.value / 100)
      : promo.type === "fixed"
        ? promo.value
        : 0
    : 0;
  const promoLabel = promo?.label ?? null;

  const tax = (subtotal - promoDiscount) * 0.08;
  const total = subtotal - promoDiscount + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
        promoCode,
        promoDiscount,
        promoLabel,
        applyPromoCode,
        removePromoCode,
        shippingMethod,
        setShippingMethod,
        shippingCost,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
