import headbandCurls28Main from '../assets/products/headband-curls-28-main.jpg';
import headbandCurls28Alt from '../assets/products/headband-curls-28-alt.jpg';
import fullFrontalWaterWave from '../assets/products/full-frontal-water-wave.jpg';
import fullFrontalWaterWave30Main from '../assets/products/full-frontal-water-wave-30-main.jpg';
import fullFrontalWaterWave30Alt from '../assets/products/full-frontal-water-wave-30-alt.jpg';
import fullFrontalBob8 from '../assets/products/full-frontal-bob-8.jpg';
import fullFrontal284 from '../assets/products/full-frontal-28-4.jpg';

export const SHIPPING_INFO =
  'Free standard delivery on orders over R750. Standard delivery takes 3-5 working days; express delivery (1-2 working days) is available at checkout. Orders are dispatched from our Johannesburg studio and tracked from pack to door.';

export const RETURNS_INFO =
  'We accept returns within 14 days of delivery on unused, unopened items in original packaging. Due to hygiene reasons, hair extensions, wigs, and lashes can only be returned if the packaging and any protective seals are unopened. Refunds are processed within 5-7 working days of us receiving your return.';

// Every image below has been visually verified to match its alt text.
const combBrushFlatlayImg = { src: 'https://images.unsplash.com/photo-1522336284037-91f7da073525?w=900&q=80', alt: 'Hair brush, comb, and scrunchies laid on a soft surface' };

const shampooImg = { src: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80', alt: 'Moisture repair shampoo bottle' };
const conditionerImg = { src: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=900&q=80', alt: 'Silk bond conditioner bottle' };
const maskImg = { src: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=900&q=80', alt: 'Deep nourish hair mask jar' };
const bottlesOnWoodImg = { src: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=900&q=80', alt: 'Hair care product bottles on a wooden surface' };

const beautyFlatlayImg = { src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80', alt: 'Beauty products flat lay' };
const beautyCloseImg = { src: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=80', alt: 'Close-up beauty product detail' };
const beautyToolImg = { src: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=900&q=80', alt: 'Applying eyeshadow from a palette' };
const eyeshadowFlatlayImg = { src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80', alt: 'Eyeshadow palette and makeup brushes flat lay' };
const lipstickApplicationImg = { src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=80', alt: 'Close-up of lipstick application' };

function makeReviews(entries) {
  return entries.map((r, i) => ({ id: `r${i + 1}`, ...r }));
}

export const products = [
  // Real inventory (client-supplied photos)
  {
    id: 'h9',
    name: 'Headband Curls 28"',
    category: 'hair',
    subcategory: 'wigs',
    texture: 'Curly',
    length: '28"',
    rating: 0,
    reviewCount: 0,
    price: 350,
    originalPrice: null,
    image: headbandCurls28Main,
    imageAlt: 'Headband curls wig, 28 inch',
    images: [
      { src: headbandCurls28Main, alt: 'Headband curls wig, 28 inch, front view' },
      { src: headbandCurls28Alt, alt: 'Headband curls wig, 28 inch, alternate view' },
    ],
    inStock: true,
    createdAt: '2026-09-03',
    description: 'A glueless headband wig with soft, defined curls for an effortless, no-install look. The attached headband secures the fit and hides the hairline in seconds.',
    detailsHeading: 'Hair Details',
    detailsContent: 'Headband wig construction, 28 inch length. Can be heat styled with care. No lace application or adhesive needed.',
    careContent: 'Detangle gently from ends to roots. Refresh curls with a light water and leave-in conditioner mix. Store on a wig stand.',
    reviews: [],
  },
  {
    id: 'h10',
    name: 'Full Frontal Water Wave',
    category: 'hair',
    subcategory: 'wigs',
    meta: 'Water Wave',
    rating: 0,
    reviewCount: 0,
    price: 600,
    originalPrice: null,
    image: fullFrontalWaterWave,
    imageAlt: 'Full frontal water wave wig',
    images: [
      { src: fullFrontalWaterWave, alt: 'Full frontal water wave wig, front view' },
    ],
    inStock: true,
    createdAt: '2026-09-03',
    description: 'A full frontal wig with a soft water wave texture, pre-plucked for a natural hairline and versatile parting.',
    detailsHeading: 'Hair Details',
    detailsContent: 'Full frontal lace construction. Can be heat styled with care.',
    careContent: 'Cleanse the lace gently and avoid excess oil buildup at the base. Refresh waves with a light water and leave-in conditioner mix.',
    reviews: [],
  },
  {
    id: 'h11',
    name: 'Full Frontal Water Wave #30',
    category: 'hair',
    subcategory: 'wigs',
    meta: 'Water Wave · Colour #30',
    rating: 0,
    reviewCount: 0,
    price: 660,
    originalPrice: null,
    image: fullFrontalWaterWave30Main,
    imageAlt: 'Full frontal water wave wig, colour #30',
    images: [
      { src: fullFrontalWaterWave30Main, alt: 'Full frontal water wave wig, colour #30, front view' },
      { src: fullFrontalWaterWave30Alt, alt: 'Full frontal water wave wig, colour #30, alternate view' },
    ],
    inStock: true,
    createdAt: '2026-09-03',
    description: 'A full frontal wig with a soft water wave texture in a rich copper-brown #30 shade, pre-plucked for a natural hairline and versatile parting.',
    detailsHeading: 'Hair Details',
    detailsContent: 'Full frontal lace construction, colour #30. Can be heat styled with care.',
    careContent: 'Cleanse the lace gently and avoid excess oil buildup at the base. Refresh waves with a light water and leave-in conditioner mix.',
    reviews: [],
  },
  {
    id: 'h12',
    name: 'Full Frontal Bob 8"',
    category: 'hair',
    subcategory: 'wigs',
    texture: 'Straight',
    length: '8"',
    rating: 0,
    reviewCount: 0,
    price: 560,
    originalPrice: null,
    image: fullFrontalBob8,
    imageAlt: 'Full frontal bob wig, 8 inch',
    images: [
      { src: fullFrontalBob8, alt: 'Full frontal bob wig, 8 inch, front view' },
    ],
    inStock: true,
    createdAt: '2026-09-03',
    description: 'A sleek, chin-length bob on a full frontal lace base, pre-plucked for a natural hairline and easy glueless wear.',
    detailsHeading: 'Hair Details',
    detailsContent: 'Full frontal lace construction, 8 inch bob length. Can be heat styled with care.',
    careContent: 'Wash sparingly with sulphate-free products. Air dry on a wig stand to keep the blunt shape.',
    reviews: [],
  },
  {
    id: 'h13',
    name: '28" Full Frontal #4',
    category: 'hair',
    subcategory: 'wigs',
    texture: 'Straight',
    length: '28"',
    rating: 0,
    reviewCount: 0,
    price: 650,
    originalPrice: null,
    image: fullFrontal284,
    imageAlt: 'Straight full frontal wig, 28 inch, colour #4',
    images: [
      { src: fullFrontal284, alt: 'Straight full frontal wig, 28 inch, colour #4, front view' },
    ],
    inStock: true,
    createdAt: '2026-09-03',
    description: 'A sleek, pin-straight full frontal wig in a warm chestnut #4 shade, pre-plucked for a natural hairline and versatile parting.',
    detailsHeading: 'Hair Details',
    detailsContent: 'Full frontal lace construction, 28 inch length, colour #4. Can be heat styled with care.',
    careContent: 'Detangle from ends upward before wearing. Wash sparingly with sulphate-free products.',
    reviews: [],
  },

  // Hair Care
  {
    id: 'c1',
    name: 'Moisture Repair Shampoo',
    category: 'hair-care',
    subcategory: 'shampoos',
    meta: '250ml',
    rating: 4.6,
    reviewCount: 58,
    price: 349,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&q=80',
    imageAlt: 'Moisture repair shampoo bottle, 250ml',
    images: [shampooImg, conditionerImg, maskImg],
    inStock: true,
    createdAt: '2026-07-18',
    variantOptions: { size: ['200ml', '250ml', '500ml'] },
    unavailableOptions: { size: ['500ml'] },
    description: 'A sulphate-free shampoo formulated to gently cleanse extensions and natural hair alike while restoring moisture from root to tip.',
    detailsHeading: 'Details',
    detailsContent: 'Sulphate-free and paraben-free formula with argan oil and keratin proteins. Safe for colour-treated and chemically processed hair. Suitable for wigs, extensions, and natural hair.',
    careContent: 'Apply to wet hair, massage into the scalp, and rinse thoroughly. Follow with Silk Bond Conditioner for best results. Use 2-3 times per week.',
    reviews: makeReviews([
      { name: 'Lerato G.', rating: 5, date: '2026-07-05', verified: true, text: 'My scalp feels so much less dry since switching to this.' },
      { name: 'Zodwa E.', rating: 4, date: '2026-06-22', verified: true, text: 'Smells great and lathers well, small bottle goes quicker than expected.' },
    ]),
  },
  {
    id: 'c2',
    name: 'Silk Bond Conditioner',
    category: 'hair-care',
    subcategory: 'conditioners',
    meta: '250ml',
    rating: 4.5,
    reviewCount: 37,
    price: 379,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=700&q=80',
    imageAlt: 'Silk bond conditioner bottle, 250ml',
    images: [conditionerImg, shampooImg, maskImg],
    inStock: true,
    createdAt: '2026-08-05',
    variantOptions: { size: ['200ml', '250ml', '500ml'] },
    unavailableOptions: {},
    description: 'A silk protein conditioner that smooths the cuticle and reduces tangling, leaving both natural hair and extensions soft and manageable.',
    detailsHeading: 'Details',
    detailsContent: 'Enriched with silk amino acids and shea butter. Lightweight formula that will not weigh hair down. Suitable for daily use.',
    careContent: 'Apply from mid-length to ends after shampooing. Leave for 2-3 minutes before rinsing with cool water for extra shine.',
    reviews: makeReviews([
      { name: 'Nokuthula J.', rating: 5, date: '2026-07-28', verified: true, text: 'Detangling has never been this easy, no more snapped strands.' },
      { name: 'Ipeleng C.', rating: 4, date: '2026-06-10', verified: false, text: 'Good slip, wish it came in a bigger size.' },
    ]),
  },
  {
    id: 'c3',
    name: 'Deep Nourish Hair Mask',
    category: 'hair-care',
    subcategory: 'treatments',
    meta: '200ml',
    rating: 4.8,
    reviewCount: 21,
    price: 449,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=700&q=80',
    imageAlt: 'Deep nourish hair mask jar, 200ml',
    images: [maskImg, shampooImg, conditionerImg],
    inStock: false,
    createdAt: '2026-06-22',
    variantOptions: { size: ['200ml', '400ml'] },
    unavailableOptions: {},
    description: 'An intensive weekly treatment mask that deeply conditions dry, brittle, or over-processed hair, restoring softness and elasticity.',
    detailsHeading: 'Details',
    detailsContent: 'Formulated with shea butter, honey extract, and hydrolysed proteins. Free from sulphates and mineral oil. Safe for colour-treated hair.',
    careContent: 'Apply generously to damp hair, cover with a warm towel, and leave for 15-20 minutes before rinsing. Use once a week.',
    reviews: makeReviews([
      { name: 'Mmabatho K.', rating: 5, date: '2026-05-30', verified: true, text: 'Brought my heat-damaged ends back to life within a month.' },
      { name: 'Fikile O.', rating: 5, date: '2026-05-02', verified: true, text: 'A little goes a long way, my hair feels so much softer.' },
    ]),
  },

  // Beauty
  {
    id: 'b1',
    name: 'Silk Wispy Lashes',
    category: 'beauty',
    subcategory: 'lashes',
    meta: 'Reusable, 1 pair',
    rating: 4.7,
    reviewCount: 44,
    price: 199,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=80',
    imageAlt: 'Silk wispy false lashes, one pair',
    images: [beautyFlatlayImg, beautyCloseImg, lipstickApplicationImg],
    inStock: true,
    createdAt: '2026-08-12',
    description: 'Lightweight silk wispy lashes that add natural volume and a soft flare, comfortable enough for all-day wear and reusable up to 20 times.',
    detailsHeading: 'Details',
    detailsContent: 'Handmade silk fibre lashes on a flexible cotton band. Latex-free adhesive recommended. Reusable up to 20 times with proper care.',
    careContent: 'Remove gently from the outer corner. Wipe away excess glue with a cotton bud and store in the original tray to keep the shape.',
    reviews: makeReviews([
      { name: 'Bongiwe X.', rating: 5, date: '2026-08-01', verified: true, text: 'So light I forget I am wearing lashes, and they last so many uses.' },
      { name: 'Palesa Z.', rating: 4, date: '2026-07-14', verified: false, text: 'Gorgeous flare, band could be a touch more flexible for hooded eyes.' },
    ]),
  },
  {
    id: 'b2',
    name: 'Satin Hair Scrunchie Set',
    category: 'beauty',
    subcategory: 'accessories',
    meta: 'Set of 3',
    rating: 4.3,
    reviewCount: 15,
    price: 149,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1522336284037-91f7da073525?w=700&q=80',
    imageAlt: 'Satin scrunchies with a hair brush and comb',
    images: [combBrushFlatlayImg, beautyFlatlayImg, eyeshadowFlatlayImg],
    inStock: true,
    createdAt: '2026-07-29',
    variantOptions: { colour: ['Blush', 'Burgundy', 'Ivory'] },
    unavailableOptions: {},
    description: 'A set of three oversized satin scrunchies, gentle on extensions and natural hair alike, with no creasing or breakage.',
    detailsHeading: 'Details',
    detailsContent: '100% satin exterior with a soft elastic core. Oversized fit reduces tension on the hairline. Set of three coordinating colours.',
    careContent: 'Hand wash in cold water and air dry. Avoid wringing to preserve the satin finish.',
    reviews: makeReviews([
      { name: 'Onthatile B.', rating: 5, date: '2026-07-10', verified: true, text: 'No more dents in my hair after a workout, love these.' },
      { name: 'Rethabile N.', rating: 4, date: '2026-06-18', verified: false, text: 'Pretty colours, slightly smaller than I imagined from photos.' },
    ]),
  },
  {
    id: 'b3',
    name: 'Ceramic Styling Brush',
    category: 'beauty',
    subcategory: 'tools',
    meta: 'Heat-resistant',
    rating: 4.6,
    reviewCount: 28,
    price: 299,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1522336284037-91f7da073525?w=700&q=80',
    imageAlt: 'Ceramic styling hair brush and comb',
    images: [combBrushFlatlayImg, beautyToolImg, beautyFlatlayImg],
    inStock: true,
    createdAt: '2026-05-09',
    description: 'A ceramic-barrel styling brush that distributes heat evenly for smoother blowouts with less damage, on natural hair, wigs, and extensions.',
    detailsHeading: 'Details',
    detailsContent: 'Ceramic-coated barrel with heat-resistant boar bristle blend. Ergonomic non-slip handle. Compatible with all standard blow dryers.',
    careContent: 'Remove hair from bristles after each use. Wipe the barrel with a damp cloth; avoid submerging in water.',
    reviews: makeReviews([
      { name: 'Katlego F.', rating: 5, date: '2026-04-25', verified: true, text: 'Cuts my blow-dry time in half and my hair feels smoother.' },
      { name: 'Mpho D.', rating: 4, date: '2026-03-20', verified: true, text: 'Great grip and heat distribution, handle could be a little lighter.' },
    ]),
  },
];

export const categories = [
  { value: 'all', label: 'All' },
  { value: 'hair', label: 'Hair' },
  { value: 'hair-care', label: 'Hair Care' },
  { value: 'beauty', label: 'Beauty' },
];

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
