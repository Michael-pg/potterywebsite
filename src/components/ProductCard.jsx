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
