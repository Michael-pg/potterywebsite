import { useState } from 'react'
import FilterBar from '../components/FilterBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SoldSection from '../components/SoldSection.jsx'

const CATEGORIES = ['All', 'Vase', 'Kitchen', 'Home']

export default function Shop({ products, path }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const active = products.filter((p) => !p.sold)
  const sold = products.filter((p) => p.sold)

  const filtered =
    activeFilter === 'All'
      ? active
      : active.filter((p) => p.category === activeFilter.toLowerCase())

  return (
    <>
      <section className="shop-head">
        <h1 className="shop-title">Shop</h1>
        <p className="shop-count">{active.length} pieces available</p>
      </section>

      <FilterBar
        categories={CATEGORIES}
        active={activeFilter}
        onChange={setActiveFilter}
      />

      {filtered.length > 0 ? (
        <div className="shop-grid">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} path={path} />
          ))}
        </div>
      ) : (
        <p className="shop-empty">Nothing here right now — check back after the next firing.</p>
      )}

      <SoldSection products={sold} path={path} />
    </>
  )
}
