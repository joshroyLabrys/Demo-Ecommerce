# src/components/

All React components used across the application.

## Directory Structure

```
components/
├── ui/                      # shadcn/ui primitives (auto-installed)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   ├── dropdown-menu.tsx
│   ├── sheet.tsx
│   ├── tabs.tsx
│   ├── dialog.tsx
│   ├── separator.tsx
│   ├── avatar.tsx
│   ├── carousel.tsx
│   ├── checkbox.tsx
│   ├── label.tsx
│   ├── radio-group.tsx
│   ├── select.tsx
│   ├── table.tsx
│   ├── textarea.tsx
│   ├── pagination.tsx
│   └── sonner.tsx
│
├── site-header.tsx           # Frosted glass navbar with nav, cart, auth
├── site-footer.tsx           # Footer with links and branding
├── product-card.tsx          # Reusable product card for grids
├── promo-banner-01.tsx       # Promotional banner (CommerCN, used on homepage)
│
└── [installed block references]
    ├── storefront-hero-1.tsx     # ShadcnStore hero template
    ├── product-overview-1.tsx    # ShadcnStore product detail template
    ├── shopping-cart-1.tsx       # ShadcnStore cart template
    ├── checkout-form-1.tsx       # ShadcnStore checkout template
    ├── category-filter-1.tsx     # ShadcnStore filter bar template
    ├── review-rating-1.tsx       # ShadcnStore reviews template
    ├── order-history-1.tsx       # ShadcnStore order history template
    ├── category-01.tsx           # CommerCN category grid template
    ├── product-card-01.tsx       # CommerCN product card template
    └── order-01.tsx              # CommerCN order detail template
```

## Custom Components (actively used)

### `site-header.tsx`
The main navigation bar. Features:
- Frosted glass effect (`backdrop-blur-xl bg-white/80`)
- MERIDIAN logo linking to home
- Desktop navigation links (Shop, Electronics, Fashion, Home, Wellness)
- Search icon linking to categories page
- Auth dropdown (sign in / account menu / sign out)
- Cart icon with item count badge
- Mobile hamburger menu via shadcn `Sheet`

### `site-footer.tsx`
Footer with four columns: brand description, shop links, company links, support links. Server component (no interactivity needed).

### `product-card.tsx`
Reusable product card used in category listings, featured sections, and related products. Features:
- Unsplash image with hover zoom effect
- NEW and discount badges
- Quick-action buttons (wishlist, add to cart) on hover
- Star rating display
- Price with optional strikethrough original price
- Links to product detail page
- Integrated with `CartContext` for add-to-cart

### `promo-banner-01.tsx`
Dismissible promotional banner strip. Used at the top of the homepage. Modified from CommerCN to link to `/categories`.

## Installed Block Components (reference templates)

These were installed via the shadcn CLI from ShadcnStore and CommerCN registries. They are **not directly used** in the page routes (the pages use custom implementations wired to contexts instead), but they serve as reference implementations and can be imported if needed.

To use one directly:
```tsx
import StorefrontHero1 from "@/components/storefront-hero-1";
// or
import { CategoryOne } from "@/components/category-01";
```

## shadcn/ui Primitives (`ui/`)

Standard shadcn/ui components installed via CLI. These are the building blocks used by both custom components and installed blocks. Do not edit these directly — they are managed by the shadcn CLI.

To add more:
```bash
npx shadcn@latest add accordion     # or any component name
```
