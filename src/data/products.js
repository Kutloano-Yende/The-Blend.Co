// Product data now lives in Supabase (see src/data/fetchProducts.js and
// src/data/fetchProduct.js) so the admin panel and storefront share one
// source of truth. This file only keeps the static content that isn't
// per-product: shop category tabs and info-page copy.

export const SHIPPING_INFO =
  'We ship every order via PAXI. Normal delivery is R60, and Standard delivery is R110.';

export const RETURNS_INFO =
  'We accept returns within 14 days of delivery on unused, unopened items in original packaging. Due to hygiene reasons, hair extensions, wigs, and lashes can only be returned if the packaging and any protective seals are unopened. Refunds are processed within 5-7 working days of us receiving your return.';

export const categories = [
  { value: 'all', label: 'All' },
  { value: 'hair', label: 'Hair' },
  { value: 'hair-care', label: 'Hair Care' },
  { value: 'beauty', label: 'Beauty' },
];
