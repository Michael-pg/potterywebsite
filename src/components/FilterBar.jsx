export default function FilterBar({ categories, active, onChange }) {
  return (
    <div className="filters">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-btn${active === cat ? ' active' : ''}`}
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
