import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't reset scroll position on navigation the way a full
// page load would — the DOM never unmounts, so if you click a link while
// scrolled down (e.g. a footer link), you stay scrolled down on the new
// page/filter too. This restores the behavior users expect.
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}

export default ScrollToTop;
