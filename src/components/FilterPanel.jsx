import './FilterPanel.css';

export const PRICE_BANDS = [
  { key: 'under-500', label: 'Under R500', test: (p) => p < 500 },
  { key: '500-1500', label: 'R500 – R1,500', test: (p) => p >= 500 && p < 1500 },
  { key: '1500-2500', label: 'R1,500 – R2,500', test: (p) => p >= 1500 && p < 2500 },
  { key: '2500-3500', label: 'R2,500 – R3,500', test: (p) => p >= 2500 && p < 3500 },
  { key: 'over-3500', label: 'R3,500+', test: (p) => p >= 3500 },
];

function FilterSection({ title, children }) {
  return (
    <fieldset className="filter-section">
      <legend className="filter-section-title">{title}</legend>
      {children}
    </fieldset>
  );
}

function CheckboxOption({ label, count, checked, onChange }) {
  return (
    <label className="filter-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="filter-checkbox-box" aria-hidden="true"></span>
      <span className="filter-checkbox-label">{label}</span>
      {typeof count === 'number' && <span className="filter-checkbox-count">({count})</span>}
    </label>
  );
}

function FilterPanel({
  showTexture,
  showLength,
  lengthOptions,
  textureOptions,
  filters,
  onToggleLength,
  onToggleTexture,
  onSetAvailability,
  onTogglePriceBand,
  onClearAll,
  hasActiveFilters,
  showTitle = true,
}) {
  return (
    <div className="filter-panel">
      {(showTitle || hasActiveFilters) && (
        <div className="filter-panel-header">
          {showTitle && <h2>Filters</h2>}
          {hasActiveFilters && (
            <button type="button" className="filter-clear-btn" onClick={onClearAll}>
              Clear All
            </button>
          )}
        </div>
      )}

      {showLength && lengthOptions.length > 0 && (
        <FilterSection title="Length">
          {lengthOptions.map((opt) => (
            <CheckboxOption
              key={opt.value}
              label={opt.value}
              count={opt.count}
              checked={filters.lengths.includes(opt.value)}
              onChange={() => onToggleLength(opt.value)}
            />
          ))}
        </FilterSection>
      )}

      {showTexture && textureOptions.length > 0 && (
        <FilterSection title="Texture">
          {textureOptions.map((opt) => (
            <CheckboxOption
              key={opt.value}
              label={opt.value}
              count={opt.count}
              checked={filters.textures.includes(opt.value)}
              onChange={() => onToggleTexture(opt.value)}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Availability">
        <label className="filter-radio">
          <input
            type="radio"
            name="availability"
            checked={filters.availability === 'all'}
            onChange={() => onSetAvailability('all')}
          />
          <span className="filter-radio-dot" aria-hidden="true"></span>
          <span>All</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="availability"
            checked={filters.availability === 'in-stock'}
            onChange={() => onSetAvailability('in-stock')}
          />
          <span className="filter-radio-dot" aria-hidden="true"></span>
          <span>In Stock</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="availability"
            checked={filters.availability === 'out-of-stock'}
            onChange={() => onSetAvailability('out-of-stock')}
          />
          <span className="filter-radio-dot" aria-hidden="true"></span>
          <span>Out of Stock</span>
        </label>
      </FilterSection>

      <FilterSection title="Price">
        {PRICE_BANDS.map((band) => (
          <CheckboxOption
            key={band.key}
            label={band.label}
            checked={filters.priceBands.includes(band.key)}
            onChange={() => onTogglePriceBand(band.key)}
          />
        ))}
      </FilterSection>
    </div>
  );
}

export default FilterPanel;
