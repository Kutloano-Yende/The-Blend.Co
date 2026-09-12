import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import FilterPanel, { PRICE_BANDS } from '../components/FilterPanel';
import { fetchProducts } from '../data/fetchProducts';
import { categories } from '../data/products';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function makeEmptyFilters(overrides = {}) {
  return {
    search: '',
    lengths: [],
    textures: [],
    availability: 'all',
    priceBands: [],
    sort: 'newest',
    saleOnly: false,
    ...overrides,
  };
}

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSubcategory = searchParams.get('subcategory') || null;
  const initialSort = searchParams.get('sort') || 'newest';
  const initialSaleOnly = searchParams.get('sale') === 'true';
  const initialSearch = searchParams.get('search') || '';

  const [status, setStatus] = useState('loading');
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [filters, setFilters] = useState(
    makeEmptyFilters({ sort: initialSort, saleOnly: initialSaleOnly, search: initialSearch })
  );
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const loadProducts = useCallback(() => {
    setStatus('loading');
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setStatus('success');
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSubcategory(null);
    setFilters(makeEmptyFilters());
    const next = new URLSearchParams(searchParams);
    if (value === 'all') {
      next.delete('category');
    } else {
      next.set('category', value);
    }
    next.delete('subcategory');
    next.delete('sort');
    next.delete('sale');
    setSearchParams(next, { replace: true });
  };

  const categoryFiltered = useMemo(() => {
    let list = category === 'all' ? products : products.filter((p) => p.category === category);
    if (subcategory) {
      list = list.filter((p) => p.subcategory === subcategory);
    }
    return list;
  }, [products, category, subcategory]);

  const showLength = categoryFiltered.some((p) => p.length);
  const showTexture = categoryFiltered.some((p) => p.texture);

  const lengthOptions = useMemo(() => {
    const counts = {};
    categoryFiltered.forEach((p) => {
      if (p.length) counts[p.length] = (counts[p.length] || 0) + 1;
    });
    return Object.keys(counts)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((value) => ({ value, count: counts[value] }));
  }, [categoryFiltered]);

  const textureOptions = useMemo(() => {
    const counts = {};
    categoryFiltered.forEach((p) => {
      if (p.texture) counts[p.texture] = (counts[p.texture] || 0) + 1;
    });
    return Object.keys(counts)
      .sort()
      .map((value) => ({ value, count: counts[value] }));
  }, [categoryFiltered]);

  const filteredProducts = useMemo(() => {
    let list = categoryFiltered;

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (filters.lengths.length > 0) {
      list = list.filter((p) => filters.lengths.includes(p.length));
    }

    if (filters.textures.length > 0) {
      list = list.filter((p) => filters.textures.includes(p.texture));
    }

    if (filters.availability === 'in-stock') {
      list = list.filter((p) => p.inStock);
    } else if (filters.availability === 'out-of-stock') {
      list = list.filter((p) => !p.inStock);
    }

    if (filters.priceBands.length > 0) {
      const bands = PRICE_BANDS.filter((b) => filters.priceBands.includes(b.key));
      list = list.filter((p) => bands.some((b) => b.test(p.price)));
    }

    if (filters.saleOnly) {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    const sorted = [...list];
    switch (filters.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
  }, [categoryFiltered, filters]);

  const hasActiveFilters =
    filters.lengths.length > 0 ||
    filters.textures.length > 0 ||
    filters.availability !== 'all' ||
    filters.priceBands.length > 0 ||
    filters.saleOnly;

  const clearAllFilters = () => {
    setFilters((prev) => makeEmptyFilters({ sort: prev.sort }));
    setSubcategory(null);
    const next = new URLSearchParams(searchParams);
    next.delete('subcategory');
    next.delete('sale');
    setSearchParams(next, { replace: true });
  };

  const toggleArrayValue = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const filterPanelProps = {
    showTexture,
    showLength,
    lengthOptions,
    textureOptions,
    filters,
    onToggleLength: (v) => toggleArrayValue('lengths', v),
    onToggleTexture: (v) => toggleArrayValue('textures', v),
    onSetAvailability: (v) => setFilters((prev) => ({ ...prev, availability: v })),
    onTogglePriceBand: (v) => toggleArrayValue('priceBands', v),
    onClearAll: clearAllFilters,
    hasActiveFilters,
  };

  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="shop-page">
          <div className="container shop-page-header">
            <div>
              <h1>{filters.saleOnly ? 'Sale' : subcategory ? subcategory.replace(/^\w/, (c) => c.toUpperCase()) : 'Shop'}</h1>
              {(filters.saleOnly || subcategory) && (
                <button type="button" className="shop-context-clear" onClick={clearAllFilters}>
                  ✕ Clear
                </button>
              )}
            </div>
            {status === 'success' && (
              <p className="shop-result-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>

          <div className="container category-tabs" role="tablist" aria-label="Shop by category">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={category === cat.value}
                className={`category-tab ${category === cat.value ? 'is-active' : ''}`}
                onClick={() => handleCategoryChange(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="container shop-toolbar">
            <div className="shop-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                aria-label="Search products"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <div className="shop-toolbar-actions">
              <button
                type="button"
                className="mobile-filter-toggle"
                onClick={() => setIsFilterDrawerOpen(true)}
                aria-haspopup="true"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="7" y1="12" x2="17" y2="12"></line>
                  <line x1="10" y1="18" x2="14" y2="18"></line>
                </svg>
                Filters
                {hasActiveFilters && <span className="filter-active-dot" aria-hidden="true"></span>}
              </button>

              <label className="shop-sort">
                <span className="sr-only">Sort by</span>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sort: {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="container shop-body">
            <aside className="shop-sidebar" aria-label="Product filters">
              <FilterPanel {...filterPanelProps} />
            </aside>

            <div className="shop-results">
              {status === 'loading' && <ProductGridSkeleton />}

              {status === 'error' && (
                <ErrorState message={errorMessage} onRetry={loadProducts} />
              )}

              {status === 'success' && filteredProducts.length === 0 && (
                <EmptyState onClearFilters={clearAllFilters} />
              )}

              {status === 'success' && filteredProducts.length > 0 && (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {isFilterDrawerOpen && (
        <div
          className="menu-backdrop"
          onClick={() => setIsFilterDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      {isFilterDrawerOpen && (
        <div className="filter-drawer" role="dialog" aria-modal="true" aria-label="Filter products">
          <div className="filter-drawer-header">
            <h2>Filters</h2>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsFilterDrawerOpen(false)}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          <div className="filter-drawer-body">
            <FilterPanel {...filterPanelProps} showTitle={false} />
          </div>
          <div className="filter-drawer-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsFilterDrawerOpen(false)}
            >
              Show {status === 'success' ? filteredProducts.length : ''} Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Shop;
