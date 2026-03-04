# MERIDIAN — Demo Ecommerce Platform

A full-featured demo ecommerce store built with **Next.js 15**, **shadcn/ui**, **ShadcnStore**, and **CommerCN** prebuilt blocks. Styled with an Apple-inspired frosted glass aesthetic. Designed for demonstration purposes — all data is local, no backend or integrations required.

Live on Vercel — zero configuration needed.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (opens http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

---

## Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Framework      | Next.js 15 (App Router, Turbopack)          |
| UI Components  | shadcn/ui + ShadcnStore + CommerCN blocks   |
| Styling        | Tailwind CSS v4, Inter font                 |
| State          | React Context + localStorage persistence    |
| Language       | TypeScript                                  |
| Deployment     | Vercel (zero-config)                        |

---

## Project Structure

```
Demo-Ecommerce/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout (header, footer, providers)
│   │   ├── page.tsx          # Homepage / storefront
│   │   ├── categories/       # Browse & filter products
│   │   ├── products/         # Product detail pages
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Multi-step checkout
│   │   ├── login/            # Sign in / register (fake auth)
│   │   └── account/          # Profile & order history
│   ├── components/           # UI components (custom + installed blocks)
│   │   └── ui/               # shadcn/ui primitives
│   ├── contexts/             # React context providers (auth, cart, orders)
│   └── lib/                  # Shared utilities and dummy data
├── components.json           # shadcn/ui + registry configuration
├── next.config.ts            # Next.js config (image domains)
├── tailwind / postcss        # Styling config
└── package.json              # Scripts and dependencies
```

See individual `README.md` files in each directory for detailed documentation.

---

## Features

### Storefront
- Hero section with featured products and social proof
- Category grid with Unsplash imagery
- Featured products and new arrivals sections
- Promotional banner strip
- Trust badges (free shipping, secure checkout, returns)

### Product Browsing
- 6 categories, 24 products with realistic data
- Full-text search across name, brand, and description
- Filter by category and price range
- Sort by featured, newest, price, or rating
- Active filter badges with clear controls

### Product Detail
- Large image gallery with thumbnail navigation
- Color and size selectors
- Quantity picker
- Add to cart with toast confirmation
- Wishlist toggle
- Star ratings and customer reviews
- Review submission form
- Related products section

### Shopping Cart
- Add, remove, and update item quantities
- Order summary with subtotal, shipping, tax
- Free shipping threshold indicator ($200+)
- Persistent across page reloads (localStorage)

### Checkout
- 3-step flow: Contact → Shipping → Payment
- Progress indicator with step completion
- Order summary sidebar
- Places order to localStorage on completion
- Redirects to order confirmation

### Account System
- Fake authentication (any email/password works)
- User profile stored in localStorage
- Account dashboard with stats (orders, spending)
- Full order history with status badges
- Order confirmation banner for just-placed orders

---

## Key Flows

### Shopping Flow

```
Homepage → Browse Categories → Product Detail → Add to Cart → Cart → Checkout → Order Confirmation
```

1. Visit the homepage and click "Shop Now" or browse categories
2. Use filters (search, price, sort) to find products
3. Click a product to view details, select options, set quantity
4. Click "Add to Cart" — cart icon in nav updates with badge count
5. Go to cart page — adjust quantities or remove items
6. Click "Proceed to Checkout" — fill in contact, shipping, payment
7. Click "Place Order" — order saved to localStorage, redirected to order history

### Authentication Flow

```
Nav "Sign In" → Login Page → Enter Credentials → Account Dashboard
```

1. Click "Sign In" in the navigation bar
2. Enter any email and password (or create an account)
3. User profile appears in the nav dropdown
4. Access account dashboard and order history
5. Sign out from the dropdown or account page

---

## Dummy Data

All product data lives in `src/lib/data.ts`. No API calls are made.

- **6 Categories**: Electronics, Home & Living, Fashion, Wellness, Books & Stationery, Kitchen & Dining
- **24 Products**: 4 per category, each with brand, description, pricing, ratings, Unsplash images
- **6 Reviews**: Sample customer reviews with avatars and ratings
- **Helper functions**: `getProductsByCategory()`, `searchProducts()`, `getFeaturedProducts()`, etc.

---

## Installed Block Components

These were installed from third-party shadcn registries and are available in `src/components/`:

| Component              | Source       | Purpose                              |
| ---------------------- | ------------ | ------------------------------------ |
| `storefront-hero-1`    | ShadcnStore  | Landing hero (reference)             |
| `product-overview-1`   | ShadcnStore  | Product detail template (reference)  |
| `shopping-cart-1`      | ShadcnStore  | Cart layout template (reference)     |
| `checkout-form-1`      | ShadcnStore  | Checkout form template (reference)   |
| `category-filter-1`    | ShadcnStore  | Filter bar template (reference)      |
| `review-rating-1`      | ShadcnStore  | Reviews template (reference)         |
| `order-history-1`      | ShadcnStore  | Order history template (reference)   |
| `category-01`          | CommerCN     | Category grid template (reference)   |
| `product-card-01`      | CommerCN     | Product card template (reference)    |
| `promo-banner-01`      | CommerCN     | Promo banner (used on homepage)      |
| `order-01`             | CommerCN     | Order detail template (reference)    |

Most blocks serve as reference implementations. The actual pages use custom components built with shadcn/ui primitives, integrated with the app's context providers.

---

## Deployment

### Vercel (Recommended)

1. Push to a Git repository (GitHub, GitLab, Bitbucket)
2. Import the repository in [vercel.com/new](https://vercel.com/new)
3. Deploy — no environment variables or build settings needed

### Manual

```bash
npm run build
npm start
```

The app runs on port 3000 by default.

---

## Design System

The app uses an Apple-inspired aesthetic:

- **Frosted glass**: `backdrop-blur-xl bg-white/80` on nav, `bg-white/60 backdrop-blur-sm` on cards
- **Rounded corners**: `rounded-2xl` on all major surfaces
- **Typography**: Inter font via `next/font/google`, clean sans-serif hierarchy
- **Colors**: Neutral palette with amber accent for ratings, red for sale badges
- **Transitions**: Smooth hover effects with `transition-all duration-300`
- **Shadows**: Subtle `shadow-sm` and `shadow-lg shadow-black/5` on hover

---

## License

This is a demonstration project. The installed shadcn/ui, ShadcnStore, and CommerCN components are free and open source.
