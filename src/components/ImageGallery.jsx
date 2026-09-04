import { useRef, useState } from 'react';
import './ImageGallery.css';

function ImageGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState(() => new Set());
  const [erroredIndices, setErroredIndices] = useState(() => new Set());
  const trackRef = useRef(null);
  const isScrollingProgrammatically = useRef(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(images.length - 1, index));
    setActiveIndex(clamped);
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[clamped];
    if (slide) {
      isScrollingProgrammatically.current = true;
      slide.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        inline: 'start',
        block: 'nearest',
      });
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 400);
    }
  };

  const handleScroll = () => {
    if (isScrollingProgrammatically.current) return;
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(activeIndex - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(images.length - 1);
    }
  };

  const markLoaded = (i) => setLoadedIndices((prev) => new Set(prev).add(i));
  const markErrored = (i) => setErroredIndices((prev) => new Set(prev).add(i));

  return (
    <div className="gallery">
      {images.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-label={`${productName} images`}>
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`View image ${i + 1} of ${images.length}`}
              className={`gallery-thumb ${i === activeIndex ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
            >
              <img src={img.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className="gallery-main">
        <div
          className="gallery-track"
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${productName} image gallery, image ${activeIndex + 1} of ${images.length}`}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
        >
          {images.map((img, i) => (
            <div className="gallery-slide" key={i}>
              {erroredIndices.has(i) ? (
                <div className="gallery-broken">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <path d="M21 15l-5-5L5 21"></path>
                  </svg>
                  <span>Image unavailable</span>
                </div>
              ) : (
                <>
                  {!loadedIndices.has(i) && <div className="gallery-skeleton" aria-hidden="true" />}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={loadedIndices.has(i) ? 'is-loaded' : ''}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    onLoad={() => markLoaded(i)}
                    onError={() => markErrored(i)}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          Image {activeIndex + 1} of {images.length}
        </p>

        {images.length > 1 && (
          <div className="gallery-dots" aria-hidden="true">
            {images.map((_, i) => (
              <span key={i} className={`gallery-dot ${i === activeIndex ? 'is-active' : ''}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageGallery;
