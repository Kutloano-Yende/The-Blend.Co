import './VariantSelector.css';

function VariantSelector({ label, options, unavailable = [], selected, onSelect }) {
  return (
    <fieldset className="variant-selector">
      <legend className="variant-label">
        {label}
        {selected && <span className="variant-selected-value">: {selected}</span>}
      </legend>
      <div className="variant-options" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const isUnavailable = unavailable.includes(option);
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={isUnavailable ? `${option}, unavailable` : option}
              disabled={isUnavailable}
              className={`variant-option ${isSelected ? 'is-selected' : ''} ${isUnavailable ? 'is-unavailable' : ''}`}
              onClick={() => !isUnavailable && onSelect(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default VariantSelector;
