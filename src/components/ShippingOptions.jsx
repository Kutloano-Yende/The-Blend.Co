import { useState, useEffect } from 'react';
import { getPaxiShippingQuotes } from '../lib/paxiService';
import './ShippingOptions.css';

function ShippingOptions({ address, cartTotal, onShippingSelect }) {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShippingOptions();
  }, [address]);

  const loadShippingOptions = async () => {
    if (!address?.street || !address?.city) {
      setError('Please enter a complete delivery address');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const quotes = await getPaxiShippingQuotes({
        recipientAddress: address,
        weight: calculateWeight(), // Estimate based on items
        value: cartTotal,
      });

      setShippingOptions(quotes);

      // Select first option by default
      if (quotes.length > 0) {
        handleSelectOption(quotes[0]);
      }
    } catch (err) {
      console.error('Error loading shipping options:', err);
      setError('Unable to calculate shipping. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateWeight = () => {
    // Estimate: hair products typically 0.5-2kg per item
    // This would normally come from cart items
    return 1; // Default 1kg
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onShippingSelect({
      id: option.id,
      name: option.name,
      price: option.price,
      estimatedDays: option.estimatedDays,
    });
  };

  if (error && shippingOptions.length === 0) {
    return (
      <div className="shipping-options">
        <h3>Shipping Options</h3>
        <p className="shipping-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="shipping-options">
      <h3>Shipping Method</h3>

      {loading && <p className="shipping-loading">Calculating shipping options...</p>}

      {shippingOptions.length > 0 && (
        <div className="shipping-list">
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              className={`shipping-option ${selectedOption?.id === option.id ? 'selected' : ''}`}
              onClick={() => handleSelectOption(option)}
            >
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selectedOption?.id === option.id}
                onChange={() => handleSelectOption(option)}
              />

              <div className="shipping-info">
                <div className="shipping-header">
                  <span className="shipping-name">{option.name}</span>
                  <span className="shipping-price">R{Number(option.price).toFixed(2)}</span>
                </div>

                <p className="shipping-description">{option.description}</p>

                {option.estimatedDays && (
                  <p className="shipping-estimate">
                    📅 Estimated: {option.estimatedDays} day{option.estimatedDays !== 1 ? 's' : ''}
                  </p>
                )}

                {option.features && option.features.length > 0 && (
                  <ul className="shipping-features">
                    {option.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {shippingOptions.length === 0 && !loading && !error && (
        <p className="shipping-empty">No shipping options available</p>
      )}
    </div>
  );
}

export default ShippingOptions;
