import { useState, useEffect } from 'react'
import { client } from './sanity.js'
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
              <h1 className="hero-title">Handmade Ceramics,<br />crafted with intention.</h1>
              <p className="hero-updated">
                <span>Last updated</span><br />
                <span>June 2025</span>
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
                  Each piece is wheel-thrown and fired in small batches.
                </p>
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
