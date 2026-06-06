# React + Sanity Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the static HTML pottery site to a React + Vite app that fetches products from Sanity CMS and renders a size-tiered, randomly ordered product grid.

**Architecture:** Vite + React scaffolded at the repo root. `App.jsx` fetches all products from Sanity on mount, shuffles them, and splits them into active/sold. Static sections (header, hero, footer) live as JSX in `App.jsx`. Product grid, filter bar, and sold accordion are separate components. CSS is migrated from `style.css` to `src/styles/index.css` with the gallery section replaced by new size-tier classes.

**Tech Stack:** React 18, Vite 5, @sanity/client, @sanity/image-url, Vercel (existing)

---

## File Map

| File | Status | Responsibility |
|------|--------|---------------|
| `src/main.jsx` | Create | Vite entry — mounts App into `#root` |
| `src/App.jsx` | Create | Header, hero, footer (static JSX) + fetch + state + compose components |
| `src/sanity.js` | Create | Sanity client config + `urlFor` image builder |
| `src/components/FilterBar.jsx` | Create | Category filter buttons, active state |
| `src/components/ProductGrid.jsx` | Create | Flex-column grid, maps products → ProductCard |
| `src/components/ProductCard.jsx` | Create | Image, title, description, price, inquire link, size class |
| `src/components/SoldSection.jsx` | Create | Accordion toggle, uniform 3-col sold grid |
| `src/styles/index.css` | Create | All CSS migrated from style.css + new grid classes |
| `index.html` | Modify | Stripped to Vite shell, keeps `<div id="root">` |
| `vite.config.js` | Create | Vite config with React plugin |
| `vercel.json` | Modify | Add SPA rewrite rule |
| `package.json` | Modify | Add vite, react, react-dom, @vitejs/plugin-react, @sanity/client, @sanity/image-url |
| `script.js` | Delete | Logic moved into React components |
| `style.css` | Delete | Migrated to src/styles/index.css |

---

## Task 1: Install dependencies and scaffold Vite

**Files:**
- Modify: `package.json`
- Create: `vite.config.js`
- Create: `src/main.jsx`
- Modify: `index.html`

- [ ] **Step 1: Install packages**

```bash
cd /Users/michaelperez-gelinas/Documents/Development/personal/pottery-site
npm install react react-dom
npm install -D vite @vitejs/plugin-react
npm install @sanity/client @sanity/image-url
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Create src/main.jsx**

```bash
mkdir -p src/components src/styles
```

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 4: Replace index.html with Vite shell**

Replace the entire contents of `index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MPGceramics</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Add dev script to package.json**

Open `package.json`. If it doesn't already have a `scripts` block with `"dev"`, add:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite starts at `http://localhost:5173`. The page will be blank (no App yet) — that's fine. No errors in terminal.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js src/main.jsx index.html
git commit -m "Scaffold Vite + React, install dependencies"
```

---

## Task 2: Create Sanity client

**Files:**
- Create: `src/sanity.js`

- [ ] **Step 1: Create src/sanity.js**

```js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'asj9muzn',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
```

- [ ] **Step 2: Verify the client resolves (quick smoke test)**

Create a temporary file `src/test-sanity.js`:

```js
import { client } from './sanity.js'
const products = await client.fetch(`*[_type == "product"][0..2]{title, price}`)
console.log(products)
```

Run: `node --experimental-vm-modules src/test-sanity.js` — if it errors on module syntax, that's fine, skip this step. The client will be verified when App fetches data in Task 5.

- [ ] **Step 3: Delete test file if created, commit**

```bash
rm -f src/test-sanity.js
git add src/sanity.js
git commit -m "Add Sanity client config"
```

---

## Task 3: Migrate CSS

**Files:**
- Create: `src/styles/index.css`
- (style.css stays for now — deleted in Task 11)

- [ ] **Step 1: Create src/styles/index.css**

Copy the full contents of `style.css` into `src/styles/index.css`, then make these changes:

1. **Update font paths** — change all `url('assets/` to `url('/assets/` (absolute paths for Vite):

```css
@font-face {
  font-family: 'PPMori';
  src: url('/assets/potterywebsitefont/PPMori-Extralight.otf') format('opentype');
  font-weight: 200;
  font-style: normal;
}
@font-face {
  font-family: 'PPMori';
  src: url('/assets/potterywebsitefont/PPMori-ExtralightItalic.otf') format('opentype');
  font-weight: 200;
  font-style: italic;
}
@font-face {
  font-family: 'PPMori';
  src: url('/assets/potterywebsitefont/PPMori-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'PPMori';
  src: url('/assets/potterywebsitefont/PPMori-RegularItalic.otf') format('opentype');
  font-weight: 400;
  font-style: italic;
}
@font-face {
  font-family: 'PPMori';
  src: url('/assets/potterywebsitefont/PPMori-SemiBold.otf') format('opentype');
  font-weight: 600;
  font-style: normal;
}
@font-face {
  font-family: 'PPMori';
  src: url('/assets/potterywebsitefont/PPMori-SemiBoldItalic.otf') format('opentype');
  font-weight: 600;
  font-style: italic;
}
```

2. **Replace the `.gallery` block and everything under `/* ── Gallery ──*/`** (lines 272–311 in style.css) with the new product grid classes. Keep everything else (header, hero, filters, sold, footer, responsive) exactly as-is.

Replace the gallery section with:

```css
/* ── Product Grid ────────────────────────── */
.product-grid {
  display: flex;
  flex-direction: column;
  gap: 8vh;
  padding: 0 1rem 6rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  overflow: hidden;
  background: var(--border);
}

.product-card--large  { width: 60vw; }
.product-card--medium { width: 45vw; }
.product-card--small  { width: 30vw; }
.product-card--right  { margin-left: auto; }

.product-card .img-wrap {
  overflow: hidden;
  aspect-ratio: 3 / 4;
}

.product-card .img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-card:hover .img-wrap img {
  transform: scale(1.04);
}

.product-card .item-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: clamp(0.875rem, 1.5vw, 1.5rem) 1rem;
  background: var(--bg);
  border-top: 1px solid var(--border);
  gap: 0.75rem;
  flex-shrink: 0;
}

.product-card .item-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.product-card .item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .product-card--large,
  .product-card--medium,
  .product-card--small {
    width: 100%;
    margin-left: 0;
  }

  .product-grid {
    gap: 3rem;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/index.css
git commit -m "Migrate CSS to src/styles/index.css with new product grid classes"
```

---

## Task 4: Build static App shell (header, hero, footer)

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 1: Create src/App.jsx with static structure**

```jsx
import { useState, useEffect } from 'react'
import { client, urlFor } from './sanity.js'
import FilterBar from './components/FilterBar.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import SoldSection from './components/SoldSection.jsx'

const CATEGORIES = ['All', 'Vase', 'Kitchen', 'Home']

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

export default function App() {
  const [products, setProducts] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    client
      .fetch(`*[_type == "product"]{_id,title,description,price,category,size,sold,image}`)
      .then((data) => setProducts(shuffle(data)))
  }, [])

  const active = products.filter((p) => !p.sold)
  const sold = products.filter((p) => p.sold)

  const filtered =
    activeFilter === 'All'
      ? active
      : active.filter((p) => p.category === activeFilter.toLowerCase())

  return (
    <>
      <header>
        <nav>
          <div className="nav-left">
            <a href="/" className="wordmark">MPGceramics</a>
          </div>
          <div className="nav-right">
            <a href="mailto:miperezgelinas@gmail.com" className="nav-link">Contact</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-head">
            <div className="hero-headrow">
              <h1 className="hero-title">Handmade<br />ceramics</h1>
              <p className="hero-updated">
                <span>Toronto, ON</span><br />
                <span>Est. 2023</span>
              </p>
            </div>
          </div>
          <div className="hero-band">
            <div className="hero-frame hero-frame--wide">
              <img src="/assets/hero/hero-collection.jpg" alt="Collection" />
            </div>
            <div className="hero-aside">
              <div className="hero-note">
                <p className="hero-note-body">
                  Each piece is wheel-thrown and fired in small batches.
                </p>
              </div>
              <div className="hero-frame">
                <img src="/assets/hero/hero-detail.jpg" alt="Detail" />
              </div>
            </div>
          </div>
        </section>

        <FilterBar
          categories={CATEGORIES}
          active={activeFilter}
          onChange={setActiveFilter}
        />

        <ProductGrid products={filtered} />

        <SoldSection products={sold} />
      </main>

      <footer>
        <div className="footer-info">
          <span>© 2025 MPGceramics</span>
          <a href="mailto:miperezgelinas@gmail.com">miperezgelinas@gmail.com</a>
        </div>
        <span className="footer-wordmark">MPGceramics</span>
      </footer>
    </>
  )
}
```

- [ ] **Step 2: Run dev server and verify the static shell renders**

```bash
npm run dev
```

Open `http://localhost:5173`. You should see the header, hero images, and footer. The filter bar and grid will be blank — FilterBar, ProductGrid, and SoldSection don't exist yet. Expect React errors in console about missing modules — that's fine until the next tasks.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "Add App.jsx with static shell and Sanity fetch"
```

---

## Task 5: Build FilterBar

**Files:**
- Create: `src/components/FilterBar.jsx`

- [ ] **Step 1: Create src/components/FilterBar.jsx**

```jsx
export default function FilterBar({ categories, active, onChange }) {
  return (
    <div className="filters">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-btn${active === cat ? ' active' : ''}`}
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Dev server should already be running at `http://localhost:5173`. Refresh. You should see the filter bar with All / Vase / Kitchen / Home buttons. Clicking them should update the active state (you can verify via React DevTools or just visually — the active class should apply).

- [ ] **Step 3: Commit**

```bash
git add src/components/FilterBar.jsx
git commit -m "Add FilterBar component"
```

---

## Task 6: Build ProductCard

**Files:**
- Create: `src/components/ProductCard.jsx`

- [ ] **Step 1: Create src/components/ProductCard.jsx**

```jsx
import { urlFor } from '../sanity.js'

export default function ProductCard({ product, align }) {
  const { title, description, price, size = 'medium', image } = product
  const sizeClass = `product-card--${size}`
  const alignClass = align === 'right' ? 'product-card--right' : ''
  const imgUrl = image ? urlFor(image).width(1200).auto('format').url() : null

  return (
    <article className={`product-card ${sizeClass} ${alignClass}`}>
      <div className="img-wrap">
        {imgUrl && <img src={imgUrl} alt={title} loading="lazy" />}
      </div>
      <div className="item-meta">
        <div className="item-info">
          <span className="item-title">{title}</span>
          {description && <span className="item-note">{description}</span>}
        </div>
        <div className="item-actions">
          <span className="price">${price}</span>
          <a
            href={`mailto:miperezgelinas@gmail.com?subject=Inquire%20-%20${encodeURIComponent(title)}`}
            className="inquire"
          >
            Inquire
          </a>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductCard.jsx
git commit -m "Add ProductCard component"
```

---

## Task 7: Build ProductGrid

**Files:**
- Create: `src/components/ProductGrid.jsx`

- [ ] **Step 1: Create src/components/ProductGrid.jsx**

```jsx
import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  if (!products.length) return null

  return (
    <div className="product-grid">
      {products.map((product, i) => (
        <ProductCard
          key={product._id}
          product={product}
          align={i % 2 === 0 ? 'left' : 'right'}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Refresh `http://localhost:5173`. Products should appear — each one sized by its `size` field from Sanity, alternating left/right alignment. Verify:
- Large cards are ~60vw wide
- Medium cards are ~45vw wide
- Small cards are ~30vw wide
- Every other card is right-aligned
- Big gap between items (~8vh)

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductGrid.jsx
git commit -m "Add ProductGrid component with size tiers and alternating alignment"
```

---

## Task 8: Build SoldSection

**Files:**
- Create: `src/components/SoldSection.jsx`

- [ ] **Step 1: Create src/components/SoldSection.jsx**

```jsx
import { useState } from 'react'
import { urlFor } from '../sanity.js'

export default function SoldSection({ products }) {
  const [open, setOpen] = useState(false)

  if (!products.length) return null

  return (
    <section className="sold-section">
      <button
        className="sold-toggle"
        aria-expanded={open}
        aria-controls="sold-gallery"
        onClick={() => setOpen((prev) => !prev)}
      >
        Sold
        <span className="sold-toggle-icon" aria-hidden="true">+</span>
      </button>

      <div className="sold-gallery" id="sold-gallery" hidden={!open}>
        {products.map((product) => {
          const imgUrl = product.image
            ? urlFor(product.image).width(600).auto('format').url()
            : null
          return (
            <article key={product._id} className="item sold">
              <div className="img-wrap">
                {imgUrl && (
                  <img src={imgUrl} alt={product.title} loading="lazy" />
                )}
                <span className="status-badge">Sold</span>
              </div>
              <div className="item-meta">
                <div className="item-info">
                  <span className="item-title">{product.title}</span>
                </div>
                <div className="item-actions">
                  <span className="price">${product.price}</span>
                  <span className="inquire muted">Sold</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Refresh `http://localhost:5173`. Scroll to bottom — you should see the Sold toggle button. Click it — sold products should appear in a 3-column grid. Click again — it collapses.

- [ ] **Step 3: Commit**

```bash
git add src/components/SoldSection.jsx
git commit -m "Add SoldSection accordion component"
```

---

## Task 9: Update vercel.json and clean up old files

**Files:**
- Modify: `vercel.json`
- Delete: `script.js`
- Delete: `style.css`

- [ ] **Step 1: Update vercel.json for SPA routing**

Replace the contents of `vercel.json` with:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [{ "source": "/((?!assets/).*)", "destination": "/index.html" }],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

- [ ] **Step 2: Delete old files**

```bash
rm script.js style.css
```

- [ ] **Step 3: Add studio publish script to .gitignore if not already there**

Open `.gitignore` and ensure these lines exist:
```
.superpowers/
studio/publish-all.mjs
```

- [ ] **Step 4: Verify production build works**

```bash
npm run build
```

Expected: Vite outputs `dist/` folder with no errors. If you see errors about missing modules, check imports in all components.

- [ ] **Step 5: Commit**

```bash
git add vercel.json .gitignore
git rm script.js style.css
git commit -m "Update vercel.json for SPA routing, remove old static files"
```

---

## Task 10: Push and verify Vercel deployment

- [ ] **Step 1: Push to GitHub**

```bash
git push
```

- [ ] **Step 2: Watch Vercel deploy**

Go to your Vercel dashboard. The deploy should trigger automatically. Watch the build log — it should run `npm run build` and succeed.

- [ ] **Step 3: Verify the live site**

Open the live Vercel URL. Check:
- [ ] Hero section renders with images
- [ ] Filter bar shows All / Vase / Kitchen / Home — clicking filters the grid
- [ ] Products render from Sanity with correct sizes and alternating alignment
- [ ] Sold accordion opens and closes
- [ ] Fonts load (PP Mori)
- [ ] Mobile: resize to 375px — all cards go full width, stack vertically

- [ ] **Step 4: If anything is broken, check browser console for errors and fix inline**

Common issues:
- Font 404: Check `/assets/potterywebsitefont/` paths in `src/styles/index.css`
- Hero image 404: Check `/assets/hero/` paths in `App.jsx`
- Sanity images not loading: Check `urlFor` import in ProductCard and SoldSection
- Blank grid: Open Network tab — check if the Sanity fetch succeeded

---

## Post-Deploy (optional, when ready)

Deploy Sanity Studio so you can manage products from anywhere (not just localhost):

```bash
cd studio
npx sanity deploy
```

Choose a hostname — `mpgceramics` gives you `mpgceramics.sanity.studio`.
