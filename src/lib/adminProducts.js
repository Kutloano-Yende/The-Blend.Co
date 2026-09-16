import { supabase } from './supabaseClient';

export async function fetchCategoryOptions() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id, sort_order')
    .order('sort_order');
  if (error) throw error;

  const byId = new Map(data.map((c) => [c.id, c]));
  return data
    .filter((c) => c.parent_id)
    .map((c) => ({
      id: c.id,
      label: `${byId.get(c.parent_id)?.name || '?'} > ${c.name}`,
    }));
}

export async function fetchAdminProducts() {
  const [{ data: products, error: productsError }, { data: images, error: imagesError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabase
        .from('products')
        .select('id, name, slug, price, original_price, stock_quantity, is_featured, is_new_arrival, is_archived, category_id, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('product_images').select('product_id, image_url').eq('is_primary', true),
      supabase.from('categories').select('id, name, parent_id'),
    ]);

  if (productsError) throw productsError;
  if (imagesError) throw imagesError;
  if (categoriesError) throw categoriesError;

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const imageByProductId = new Map(images.map((img) => [img.product_id, img.image_url]));

  return products.map((p) => {
    const category = categoryById.get(p.category_id);
    const parent = category?.parent_id ? categoryById.get(category.parent_id) : null;
    return {
      ...p,
      categoryLabel: category ? (parent ? `${parent.name} > ${category.name}` : category.name) : '—',
      primaryImage: imageByProductId.get(p.id) || null,
    };
  });
}

export async function fetchAdminProduct(id) {
  const [{ data: product, error: productError }, { data: images, error: imagesError }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('product_images').select('*').eq('product_id', id).eq('is_primary', true).maybeSingle(),
  ]);
  if (productError) throw productError;
  if (imagesError) throw imagesError;
  return { ...product, primaryImageUrl: images?.image_url || '' };
}

export async function uploadProductImage(file) {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

function toSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export { toSlug };

async function upsertPrimaryImage(productId, imageUrl, altText) {
  const { data: existing } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', productId)
    .eq('is_primary', true)
    .maybeSingle();

  if (!imageUrl) {
    if (existing) {
      await supabase.from('product_images').delete().eq('id', existing.id);
    }
    return;
  }

  if (existing) {
    const { error } = await supabase
      .from('product_images')
      .update({ image_url: imageUrl, alt_text: altText })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('product_images')
      .insert({ product_id: productId, image_url: imageUrl, alt_text: altText, is_primary: true, sort_order: 0 });
    if (error) throw error;
  }
}

export async function createProduct(fields) {
  const { primaryImageUrl, ...productFields } = fields;
  const { data, error } = await supabase.from('products').insert(productFields).select('id').single();
  if (error) throw error;
  await upsertPrimaryImage(data.id, primaryImageUrl, productFields.name);
  return data.id;
}

export async function updateProduct(id, fields) {
  const { primaryImageUrl, ...productFields } = fields;
  const { error } = await supabase.from('products').update(productFields).eq('id', id);
  if (error) throw error;
  await upsertPrimaryImage(id, primaryImageUrl, productFields.name);
}

export async function deleteProduct(id) {
  await supabase.from('product_variants').delete().eq('product_id', id);
  await supabase.from('product_images').delete().eq('product_id', id);
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
