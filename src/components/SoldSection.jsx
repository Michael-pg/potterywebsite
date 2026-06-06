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
