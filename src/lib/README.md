# src/lib/

Shared utilities and data layer.

## Files

### `utils.ts`

Exports the `cn()` utility for composing Tailwind CSS classes with conditional logic:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")} />
```

Built on `clsx` + `tailwind-merge` — handles class conflicts automatically (e.g., `p-2` + `p-4` resolves to `p-4`).

---

### `data.ts`

The entire product catalog and supporting data. No API calls — everything is served from this file.

#### Types

```ts
Product     // id, name, brand, price, images, category, rating, etc.
Category    // id, name, slug, description, image, productCount
Review      // id, userName, rating, content, likes, productId
```

#### Data Constants

| Constant      | Description                           | Count |
| ------------- | ------------------------------------- | ----- |
| `categories`  | All store categories                  | 6     |
| `products`    | All products with full details        | 24    |
| `reviews`     | Sample customer reviews               | 6     |

#### Categories

| Slug               | Name               | Products |
| ------------------- | ------------------- | -------- |
| `electronics`       | Electronics          | 4        |
| `home-living`       | Home & Living        | 4        |
| `fashion`           | Fashion              | 4        |
| `wellness`          | Wellness             | 4        |
| `books-stationery`  | Books & Stationery   | 4        |
| `kitchen-dining`    | Kitchen & Dining     | 4        |

#### Helper Functions

| Function                           | Returns               | Description                              |
| ---------------------------------- | --------------------- | ---------------------------------------- |
| `getProductsByCategory(slug)`      | `Product[]`           | All products in a category               |
| `getProductById(id)`               | `Product \| undefined`| Single product lookup                    |
| `getCategoryBySlug(slug)`          | `Category \| undefined`| Single category lookup                  |
| `getFeaturedProducts()`            | `Product[]`           | Products where `isFeatured === true`     |
| `getNewProducts()`                 | `Product[]`           | Products where `isNew === true`          |
| `getReviewsForProduct(productId)`  | `Review[]`            | Reviews matching a product ID            |
| `searchProducts(query)`            | `Product[]`           | Full-text search (name, brand, description, category) |

#### Adding a New Product

Add a new object to the `products` array:

```ts
{
  id: "prod-25",
  name: "New Product Name",
  brand: "Brand",
  description: "Short description",
  longDescription: "Detailed description for the product page",
  price: 99.99,
  originalPrice: 129.99,  // set equal to price if no discount
  rating: 4.5,
  reviewCount: 100,
  category: "Electronics",
  categorySlug: "electronics",
  image: "https://images.unsplash.com/photo-...",
  images: ["https://images.unsplash.com/photo-..."],
  sizes: ["S", "M", "L"],      // optional
  colors: [{ name: "Black", value: "#000" }],  // optional
  inStock: true,
  isNew: true,
  isFeatured: false,
}
```

Update the corresponding category's `productCount` if needed.
