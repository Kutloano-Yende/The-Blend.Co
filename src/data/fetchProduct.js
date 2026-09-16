import { supabase } from '../lib/supabaseClient';
import { fetchCategoriesMap, mapCategoryForProduct, fetchProducts } from './fetchProducts';

export async function fetchProduct(id) {
  const simulateError = new URLSearchParams(window.location.search).has('simulateError');
  if (simulateError) {
    throw new Error('Unable to load this product. Please check your connection and try again.');
  }

  const [categoriesMap, { data: product, error: productError }, { data: images, error: imagesError }, { data: variants, error: variantsError }] =
    await Promise.all([
      fetchCategoriesMap(),
      supabase.from('products').select('*').eq('id', id).maybeSingle(),
      supabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
      supabase.from('product_variants').select('*').eq('product_id', id),
    ]);

  if (productError) throw productError;
  if (!product) return null;
  if (imagesError) throw imagesError;
  if (variantsError) throw variantsError;

  const { category, subcategory } = mapCategoryForProduct(product.category_id, categoriesMap);

  let variantOptions = null;
  let unavailableOptions = {};
  if (variants.length > 0) {
    variantOptions = {};
    variants.forEach((v) => {
      Object.entries(v.attributes || {}).forEach(([key, value]) => {
        if (!variantOptions[key]) variantOptions[key] = [];
        if (!variantOptions[key].includes(value)) variantOptions[key].push(value);
        if (!v.is_available) {
          if (!unavailableOptions[key]) unavailableOptions[key] = [];
          if (!unavailableOptions[key].includes(value)) unavailableOptions[key].push(value);
        }
      });
    });
  }

  const primaryOrFirst = images.find((i) => i.is_primary) || images[0];

  return {
    id: product.id,
    name: product.name,
    category,
    subcategory,
    categoryId: product.category_id,
    rating: Number(product.rating) || 0,
    reviewCount: product.review_count || 0,
    price: Number(product.price),
    originalPrice: product.original_price ? Number(product.original_price) : null,
    image: primaryOrFirst?.image_url || '',
    images: images.map((i) => ({ src: i.image_url, alt: i.alt_text || product.name })),
    inStock: product.stock_quantity > 0,
    createdAt: product.created_at,
    description: product.description,
    detailsHeading: product.details_heading,
    detailsContent: product.details_content,
    careContent: product.care_content,
    variantOptions,
    unavailableOptions,
    reviews: [],
  };
}

export async function fetchRelatedProducts(product, limit = 4) {
  if (!product) return [];
  const all = await fetchProducts();
  return all.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);
}
