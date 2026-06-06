# MPGceramics — React + Sanity Conversion

**Date:** 2026-06-06  
**Status:** Approved

---

## Overview

Convert the existing static HTML pottery site to a React + Vite app connected to Sanity CMS. Products are managed entirely in Sanity Studio — no more editing HTML. The product grid is data-driven, randomly ordered, and sized by a CMS field. Vercel deployment remains unchanged.

---

## Goals

- Add/remove/edit products entirely in Sanity Studio
- Grid auto-populates and auto-sizes from CMS data
- Random product order on every page load
- No manual HTML or grid positioning ever again

---

## Architecture

**Stack:** React + Vite, Sanity JS client, existing CSS migrated to `src/styles/index.css`, Vercel hosting.

**File structure:**
```
pottery-site/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── sanity.js              ← Sanity client (project: asj9muzn, dataset: production)
│   ├── components/
│   │   ├── FilterBar.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductCard.jsx
│   │   └── SoldSection.jsx
│   └── styles/
│       └── index.css          ← existing styles migrated here
├── assets/
│   ├── hero/                  ← unchanged, referenced in App.jsx
│   ├── products/              ← local reference only; images served from Sanity CDN
│   └── potterywebsitefont/    ← unchanged
├── studio/                    ← unchanged Sanity Studio
├── index.html                 ← Vite entry (minimal shell)
├── vite.config.js
└── vercel.json                ← updated for SPA routing
```

**Data flow:**
1. `App.jsx` fetches all products from Sanity CDN on mount (GROQ query)
2. Products are split into active (`sold: false`) and sold (`sold: true`)
3. Active filter state held in `App.jsx`, passed to `FilterBar` and `ProductGrid`
4. `ProductGrid` renders the shuffled, filtered list; maps `size` → CSS span class
5. `ProductCard` renders Sanity image URL, title, price, inquire link

---

## Sanity Schema

**Product document fields:**
| Field | Type | Notes |
|-------|------|-------|
| title | string | required |
| description | text | optional, shown on card |
| price | number | required, positive |
| category | string | enum: vase, kitchen, home |
| size | string | enum: large, medium, small — drives grid layout |
| image | image | required, hotspot enabled |
| sold | boolean | default false |

---

## Grid Behavior

**Layout system:** Single-column flow of items, each sized by its `size` field. Maximum 2 items visible side-by-side in any row. Never 3 across.

**Size tiers (desktop):**
| Size | Width | Behavior |
|------|-------|----------|
| Large | 60vw max | Full row, edge-hugging, dominant |
| Medium | ~45vw | Spans row with whitespace on opposite side, alternates left/right |
| Small | ~30vw | Can appear solo or paired (two smalls in a row) |

**Randomization:** Products are shuffled client-side on every page load using `Array.sort(() => Math.random() - 0.5)`. No price, date, or category priority.

**Mobile:** All items collapse to 1 column, full width. Left/right offsets removed. Same generous gap maintained.

**Gap:** 48px+ between items. Goal is 2–3 products max visible per viewport at any time.

---

## Components

### App.jsx
- Fetches products via Sanity GROQ on mount
- Splits into `active` and `sold` arrays
- Shuffles `active` on fetch
- Holds `activeFilter` state (default: `'all'`)
- Passes filtered products to `ProductGrid`, all products to `SoldSection`

### FilterBar.jsx
- Renders All + Vase + Kitchen + Home buttons
- Receives `activeFilter` and `setFilter` from App
- Active button styled distinctly

### ProductGrid.jsx
- Receives filtered active products
- Renders CSS grid (2-col, large gaps)
- Maps size → CSS class: `card--large`, `card--medium`, `card--small`

### ProductCard.jsx
- Renders Sanity image (via `@sanity/image-url` builder)
- Title, price (`$X`), Inquire mailto link
- Applies size class for grid span
- No sold badge (active products only)

### SoldSection.jsx
- Collapsible accordion (same behavior as current site)
- Renders sold products in a simple uniform grid (no size tiers)
- Sold badge overlay on each image

---

## Deployment

- **Frontend:** Vercel, auto-deploys on push to `main`. Vite build step runs automatically.
- **`vercel.json`:** Updated to add SPA rewrite rule (all routes → `index.html`).
- **Studio:** Deployed separately to `mpgceramics.sanity.studio` (one-time `npx sanity deploy`).
- **Env vars:** None required. Sanity project ID (`asj9muzn`) and dataset (`production`) are public read-only, safe to include in client code.

---

## Out of Scope

- Cart / checkout
- Product detail pages
- Animations / transitions (can be added later)
- Illustration layer (flagged for future session)
