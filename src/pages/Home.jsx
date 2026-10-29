import { Link } from '../router.jsx'
import Gallery from '../components/Gallery.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Home({ products, gallery, path }) {
  // Only pieces still for sale, with featured ones first.
  const available = products
    .filter((p) => !p.sold)
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

  return (
    <>
      <section className="hero">
        <div className="hero-head">
          <div className="hero-headrow">
            <h1 className="hero-title">Handmade Ceramics,<br />crafted with intention.</h1>
            <p className="hero-updated">
              <span>Last updated</span><br />
              <span>October 2026</span>
            </p>
          </div>
        </div>
        <div className="hero-band">
          <div className="hero-frame hero-frame--wide">
            <img src="/assets/hero/hero-process.jpg" alt="Process" />
          </div>
          <div className="hero-aside">
            <div className="hero-frame">
              <img src="/assets/hero/hero-detail.jpg" alt="Detail" />
            </div>
            <div className="hero-note">
              <p className="hero-note-body">
                I make functional pottery in a studio in Cambridge. Everything is wheel-thrown, glaze-fired, and food-safe. No two pieces are exactly the same, but they're all built for daily use. I'm open to commissions and can always run another batch of something you've seen before. If you have an idea in mind, send me a message; I'm happy to talk through sizing, glazes, or timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {gallery.length > 0 && <Gallery images={gallery} />}

      {available.length > 0 && (
        <section>
          <div className="section-bar">
            <h2 className="section-title">Shop</h2>
            <Link to="/shop" className="section-link">Shop all →</Link>
          </div>
          <div className="shop-grid">
            {available.map((p) => (
              <ProductCard key={p._id} product={p} path={path} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
