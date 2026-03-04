# src/components/ui/

shadcn/ui primitive components. These are managed by the shadcn CLI and should not be manually edited.

## Installed Components

| Component        | shadcn Name     | Used For                                 |
| ---------------- | --------------- | ---------------------------------------- |
| `avatar.tsx`     | avatar          | User avatars in reviews, nav             |
| `badge.tsx`      | badge           | Product badges (NEW, sale), status tags  |
| `button.tsx`     | button          | All buttons and CTAs                     |
| `card.tsx`       | card            | Product cards, summary panels, forms     |
| `carousel.tsx`   | carousel        | Product image carousel (reference)       |
| `checkbox.tsx`   | checkbox        | Form checkboxes                          |
| `dialog.tsx`     | dialog          | Modal dialogs                            |
| `dropdown-menu.tsx` | dropdown-menu | Nav account dropdown, sort/filter menus |
| `input.tsx`      | input           | All text inputs                          |
| `label.tsx`      | label           | Form labels                              |
| `pagination.tsx` | pagination      | Review pagination (reference)            |
| `radio-group.tsx`| radio-group     | Payment method selection                 |
| `select.tsx`     | select          | Country/state dropdowns                  |
| `separator.tsx`  | separator       | Visual dividers                          |
| `sheet.tsx`      | sheet           | Mobile navigation drawer                 |
| `sonner.tsx`     | sonner          | Toast notifications                      |
| `table.tsx`      | table           | Order history tables (reference)         |
| `tabs.tsx`       | tabs            | Login/register tab switcher              |
| `textarea.tsx`   | textarea        | Review submission form                   |

## Adding New Components

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add accordion
npx shadcn@latest add tooltip
npx shadcn@latest add progress
```

The CLI reads `components.json` in the project root and installs components into this directory with the correct import paths.

## Configuration

The project's `components.json` also includes registries for ShadcnStore and CommerCN blocks:

```json
{
  "registries": {
    "@shadcnstore": { "url": "https://shadcnstore.com/r/{name}.json" },
    "@commercn": { "url": "https://commercn.com/r/{name}.json" }
  }
}
```

This allows installing ecommerce-specific blocks via:
```bash
npx shadcn@latest add @shadcnstore/storefront-hero-1
npx shadcn@latest add @commercn/product-card-01
```
