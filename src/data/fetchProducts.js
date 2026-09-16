import { supabase } from '../lib/supabaseClient';

export function mapCategoryForProduct(categoryId, categoriesMap) {
  const cat = categoriesMap.get(categoryId);
  const parent = cat?.parent_id ? categoriesMap.get(cat.parent_id) : null;
  return {
    category: parent ? parent.slug : cat?.slug || null,
    subcategory: parent ? cat?.slug : null,
  };
}

export async function fetchCategoriesMap() {
  const { data, error } = await supabase.from('categories').select('id, name, slug, parent_id');
  if (error) throw error;
  return new Map(data.map((c) => [c.id, c]));
}

export function mapProductRow(row, categoriesMap, primaryImage) {
  const { category, subcategory } = mapCategoryForProduct(row.category_id, categoriesMap);
  return {
    id: row.id,
    name: row.name,
    category,
    subcategory,
    categoryId: row.category_id,
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count || 0,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    image: primaryImage?.image_url || '',
    imageAlt: primaryImage?.alt_text || row.name,
    inStock: row.stock_quantity > 0,
    createdAt: row.created_at,
    isFeatured: row.is_featured,
  };
}

export async function fetchProducts() {
  const simulateError = new URLSearchParams(window.location.search).has('simulateError');
  if (simulateError) {
    throw new Error('Unable to load products. Please check your connection and try again.');
  }

  const [categoriesMap, { data: products, error: productsError }, { data: images, error: imagesError }] =
    await Promise.all([
      fetchCategoriesMap(),
      supabase.from('products').select('*').eq('is_archived', false).order('created_at', { ascending: false }),
      supabase.from('product_images').select('*').eq('is_primary', true),
    ]);

  if (productsError) throw productsError;
  if (imagesError) throw imagesError;

  const imageByProduct = new Map(images.map((img) => [img.product_id, img]));
  return products.map((p) => mapProductRow(p, categoriesMap, imageByProduct.get(p.id)));
}
