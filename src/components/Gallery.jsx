import { urlFor } from '../sanity.js'

// Editorial placement on a 12-column grid, repeating every five images:
// a large lead, an offset companion, a staggered pair, then a full-bleed band.
const LAYOUT = ['lead', 'side', 'pair-a', 'pair-b', 'band']

export default function Gallery({ images }) {
  return (
    <div className="gallery">
      {images.map((item, i) => {
        const slot = LAYOUT[i % LAYOUT.length]
        const { width, height } = item.dimensions ?? { width: 4, height: 5 }
        const src = urlFor(item.image)
          .width(slot === 'band' ? 2000 : 1400)
          .auto('format')
          .url()

        return (
          <figure key={item._id} className={`gallery-item gallery-item--${slot}`}>
            <div className="gallery-frame" style={{ aspectRatio: `${width} / ${height}` }}>
              <img src={src} alt={item.alt || item.caption || ''} loading="lazy" />
            </div>
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
        )
      })}
    </div>
  )
}
