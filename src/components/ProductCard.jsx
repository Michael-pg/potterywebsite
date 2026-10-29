import { urlFor } from '../sanity.js'
import { Link } from '../router.jsx'

export const pieceHref = (path, product) => `${path}?piece=${encodeURIComponent(product._id)}`

export default function ProductCard({ product, path }) {
  const { title, description, price, sold, image } = product
  const imgUrl = image ? urlFor(image).width(800).auto('format').url() : null

  return (
    <article className={`product-card${sold ? ' sold' : ''}`}>
      <Link
        to={pieceHref(path, product)}
        state={{ modal: true }}
        keepScroll
        className="product-link"
        aria-label={`${title}, $${price}${sold ? ', sold' : ''}`}
      >
        <div className="img-wrap">
          {imgUrl && <img src={imgUrl} alt="" loading="lazy" />}
          {sold && <span className="status-badge">Sold</span>}
        </div>
        <div className="item-meta">
          <div className="item-info">
            <span className="item-title">{title}</span>
            {description && <span className="item-note">{description}</span>}
          </div>
          <div className="item-actions">
            <span className="price">${price}</span>
            <span className="inquire">{sold ? 'Sold' : 'View'}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
