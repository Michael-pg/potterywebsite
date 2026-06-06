import ProductCard from './ProductCard.jsx'

function buildRows(products) {
  const rows = []
  let i = 0
  while (i < products.length) {
    const curr = products[i]
    const next = products[i + 1]
    const canPair =
      next &&
      curr.size !== 'large' &&
      next.size !== 'large' &&
      !(curr.size === 'medium' && next.size === 'medium')
    if (canPair) {
      rows.push([curr, next])
      i += 2
    } else {
      rows.push([curr])
      i += 1
    }
  }
  return rows
}

export default function ProductGrid({ products }) {
  if (!products.length) return null

  const rows = buildRows(products)

  return (
    <div className="product-grid">
      {rows.map((row, i) => {
        const isSingle = row.length === 1
        const align = isSingle ? (i % 2 === 0 ? 'left' : 'right') : 'left'
        return (
          <div key={i} className={`product-row${isSingle ? '' : ' product-row--pair'}`}>
            {row.map((product) => (
              <ProductCard key={product._id} product={product} align={isSingle ? align : 'left'} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
