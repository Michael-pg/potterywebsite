import { useEffect, useRef } from 'react'
import { urlFor } from '../sanity.js'

const EMAIL = 'michaelperezgelinas@gmail.com'

function inquiryHref(product, pageUrl) {
  const { title, price, sold } = product
  const subject = sold ? `Commission inquiry — ${title}` : `Inquiry — ${title} ($${price})`
  const body = sold
    ? `Hi Michael,

I saw the ${title} (sold) and would love something similar.
${pageUrl}

What I have in mind:

Thanks,
`
    : `Hi Michael,

I'd like to buy the ${title} ($${price}).
${pageUrl}

Pickup in Cambridge or shipping?
If shipping, my ZIP code is:

Thanks,
`
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ProductModal({ product, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  const { title, description, price, category, sold, image } = product
  const imgUrl = image ? urlFor(image).width(1600).auto('format').url() : null
  const pageUrl = `${window.location.origin}/shop?piece=${encodeURIComponent(product._id)}`

  return (
    <dialog
      ref={dialogRef}
      className="pdp"
      aria-labelledby="pdp-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // Clicks on the backdrop land on the dialog element itself.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pdp-inner">
        <button className="pdp-close" onClick={onClose} aria-label="Close">×</button>

        <div className="pdp-media">
          {imgUrl && <img src={imgUrl} alt={title} />}
          {sold && <span className="status-badge">Sold</span>}
        </div>

        <div className="pdp-info">
          {category && <p className="pdp-eyebrow">{category}</p>}
          <h2 id="pdp-title" className="pdp-title">{title}</h2>
          <p className="pdp-price">{sold ? `Sold — $${price}` : `$${price}`}</p>
          {description && <p className="pdp-description">{description}</p>}

          <a className="pdp-cta" href={inquiryHref(product, pageUrl)}>
            {sold ? 'Ask about a similar piece' : 'Inquire to buy'}
          </a>

          <div className="pdp-note">
            {sold ? (
              <p>This one has found a home, but I can often make another in a similar shape or glaze. Send a note and we can talk sizing, glaze and timing.</p>
            ) : (
              <>
                <p>There's no checkout here. Send an inquiry and I'll reply to sort out payment and delivery with you directly.</p>
                <p><strong>Pickup</strong> is available around Massachusetts. <strong>Shipping</strong> isn't included in the price; costs are calculated once I know where it's headed.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}
