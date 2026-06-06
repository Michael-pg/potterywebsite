import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  if (!products.length) return null

  return (
    <div className="product-grid">
      {products.map((product, i) => (
        <ProductCard
          key={product._id}
          product={product}
          align={i % 2 === 0 ? 'left' : 'right'}
        />
      ))}
    </div>
  )
}
