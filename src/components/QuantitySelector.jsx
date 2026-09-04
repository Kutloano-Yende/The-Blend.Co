import './QuantitySelector.css';

function QuantitySelector({ value, onChange, min = 1, max = 10 }) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="quantity-selector">
      <span className="quantity-label" id="quantity-label">Quantity</span>
      <div className="quantity-stepper">
        <button
          type="button"
          className="quantity-btn"
          onClick={decrease}
          disabled={value <= min}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span
          className="quantity-value"
          role="status"
          aria-live="polite"
          aria-labelledby="quantity-label"
        >
          {value}
        </span>
        <button
          type="button"
          className="quantity-btn"
          onClick={increase}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default QuantitySelector;
