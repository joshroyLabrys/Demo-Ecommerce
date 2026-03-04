"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const promoBannerData = {
  message: "Get 20% off your first order with code WELCOME20",
  link: "/categories",
  linkText: "Shop Now",
  backgroundColor: "bg-gradient-to-r from-stone-900 via-amber-900 to-stone-900",
  textColor: "text-amber-50",
  isDismissible: true,
}

export function PromoBannerOne() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "relative flex items-center justify-center px-4 py-3",
              promoBannerData.backgroundColor,
              promoBannerData.textColor
            )}
          >
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <span>{promoBannerData.message}</span>
              {promoBannerData.link && (
                <a
                  href={promoBannerData.link}
                  className="underline underline-offset-4 hover:no-underline"
                >
                  {promoBannerData.linkText}
                </a>
              )}
            </div>

            {promoBannerData.isDismissible && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 hover:bg-primary-foreground/10"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}