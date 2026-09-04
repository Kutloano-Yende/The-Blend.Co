import { useId, useState } from 'react';
import './ExpandableSection.css';

function ExpandableSection({ heading, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="expandable-section">
      <h3>
        <button
          type="button"
          className="expandable-trigger"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen(!isOpen)}
        >
          {heading}
          <span className={`expandable-icon ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
            +
          </span>
        </button>
      </h3>
      {isOpen && (
        <div className="expandable-content" id={contentId}>
          {children}
        </div>
      )}
    </div>
  );
}

export default ExpandableSection;
