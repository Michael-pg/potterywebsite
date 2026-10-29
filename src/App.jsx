import { useState, useEffect } from 'react'
import { client } from './sanity.js'
import { useLocation, navigate, Link } from './router.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductModal from './components/ProductModal.jsx'

const QUERY = `{
  "products": *[_type == "product"]{_id,title,description,price,category,sold,featured,image},
  "gallery": *[_type == "galleryImage"] | order(order asc){
    _id, alt, caption, image, "dimensions": image.asset->metadata.dimensions
  }
}`

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

export default function App() {
  const { path, query } = useLocation()
  const [products, setProducts] = useState([])
  const [gallery, setGallery] = useState([])

  useEffect(() => {
    client.fetch(QUERY).then((data) => {
      setProducts(shuffle(data.products))
      setGallery(data.gallery)
    })
  }, [])

  const isShop = path.startsWith('/shop')
  const piece = products.find((p) => p._id === query.get('piece'))

  // Opened from a card: step back so the Back button doesn't reopen it.
  // Opened from a shared link: drop the query in place.
  const closePiece = () => {
    if (window.history.state?.modal) window.history.back()
    else navigate(path, { replace: true })
  }

  return (
    <>
      <header>
        <nav>
          <div className="nav-left">
            <Link to="/" className="wordmark">MPGceramics</Link>
          </div>
          <div className="nav-right">
            <Link to="/shop" className={`nav-link${isShop ? ' active' : ''}`}>Shop</Link>
            <a href="mailto:michaelperezgelinas@gmail.com" className="nav-link">Contact</a>
          </div>
        </nav>
      </header>

      <main>
        {isShop ? (
          <Shop products={products} path={path} />
        ) : (
          <Home products={products} gallery={gallery} path={path} />
        )}
      </main>

      {piece && <ProductModal key={piece._id} product={piece} onClose={closePiece} />}

      <footer>
        <div className="footer-info">
          <span>© 2026 MPGceramics</span>
          <a href="mailto:michaelperezgelinas@gmail.com">michaelperezgelinas@gmail.com</a>
        </div>
        <span className="footer-wordmark">MPGceramics</span>
      </footer>
    </>
  )
}
