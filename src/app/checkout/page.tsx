"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Shield,
  Truck,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/contexts/order-context";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [showCvv, setShowCvv] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    handleInputChange("cardNumber", formatted);
  };

  const handleExpiryChange = (value: string) => {
    const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
    handleInputChange("expiryDate", formatted);
  };

  const directionRef = useRef(1);
  const nextStep = () => { directionRef.current = 1; setStep((prev) => Math.min(prev + 1, 3)); };
  const prevStep = () => { directionRef.current = -1; setStep((prev) => Math.max(prev - 1, 1)); };

  const handlePlaceOrder = () => {
    const order = placeOrder(
      items,
      { subtotal, shipping, tax, total },
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }
    );
    clearCart();
    toast.success("Order placed successfully!");
    router.push(`/account/orders?placed=${order.orderNumber}`);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32">
        <Check className="mb-4 h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold">No items in cart</h2>
        <p className="mt-2 text-muted-foreground">Add items to proceed to checkout</p>
        <Link href="/categories">
          <Button className="mt-6 rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Secure Checkout</h1>
        <p className="mt-1 text-muted-foreground">Complete your purchase in a few steps</p>
      </div>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-0">
          {[
            { num: 1, label: "Contact" },
            { num: 2, label: "Shipping" },
            { num: 3, label: "Payment" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    backgroundColor: step >= s.num ? 'var(--color-foreground)' : 'var(--color-muted)',
                    color: step >= s.num ? 'var(--color-background)' : 'var(--color-muted-foreground)',
                    scale: step === s.num ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
                >
                  {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                </motion.div>
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </div>
              {i < 2 && (
                <div className="relative mb-5 h-0.5 w-16 overflow-hidden rounded bg-neutral-200 sm:w-24">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded bg-foreground"
                    initial={{ width: '0%' }}
                    animate={{ width: step > s.num ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {step === 1 && "Contact Information"}
                {step === 2 && "Shipping Address"}
                {step === 3 && "Payment Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence mode="wait" initial={false}>
                {/* Step 1 */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: directionRef.current * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: directionRef.current * -30 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1.5 rounded-lg"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="mt-1.5 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="mt-1.5 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1.5 rounded-lg"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: directionRef.current * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: directionRef.current * -30 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="address">Street address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="mt-1.5 rounded-lg"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="mt-1.5 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          className="mt-1.5 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="zipCode">ZIP code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          className="mt-1.5 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(v) => handleInputChange("country", v)}
                        >
                          <SelectTrigger className="mt-1.5 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: directionRef.current * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: directionRef.current * -30 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="space-y-6"
                  >
                    <div>
                      <Label>Payment method</Label>
                      <RadioGroup defaultValue="card" className="mt-2">
                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2 font-normal">
                            <CreditCard className="h-4 w-4" /> Credit or debit card
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        maxLength={19}
                        className="mt-1.5 rounded-lg"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          maxLength={5}
                          className="mt-1.5 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <div className="relative">
                          <Input
                            id="cvv"
                            type={showCvv ? "text" : "password"}
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                            maxLength={4}
                            className="mt-1.5 rounded-lg pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1.5 h-8 w-8"
                            onClick={() => setShowCvv(!showCvv)}
                          >
                            {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                          className="mt-1.5 rounded-lg"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  className="gap-1.5 rounded-full"
                  onClick={step === 1 ? () => router.push("/cart") : prevStep}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {step < 3 ? (
                  <Button className="rounded-full px-8" onClick={nextStep}>
                    Continue
                  </Button>
                ) : (
                  <Button className="gap-2 rounded-full px-8" onClick={handlePlaceOrder}>
                    <Lock className="h-4 w-4" /> Place Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24 rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                      {item.quantity}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  SSL encrypted checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" />
                  {shipping === 0 ? "Free shipping included" : "Free shipping on orders over $200"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
