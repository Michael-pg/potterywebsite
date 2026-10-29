import { useState } from 'react'
import ProductCard from './ProductCard.jsx'

export default function SoldSection({ products, path }) {
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

      <div className="shop-grid sold-gallery" id="sold-gallery" hidden={!open}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} path={path} />
        ))}
      </div>
    </section>
  )
}
