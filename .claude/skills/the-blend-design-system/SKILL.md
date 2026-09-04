# The Blend.Co Design System Skill

## Purpose

Create and review interfaces for The Blend.Co, a premium South African hair and beauty e-commerce brand.

This skill is the visual and UX source of truth for the project. Use it together with Anthropic's `frontend-design` skill when available.

## Brand identity

Brand name: The Blend.Co

Positioning: premium hair and beauty e-commerce.

Visual direction:
- Luxury beauty
- Editorial
- Modern
- Feminine but sophisticated
- Premium without looking flashy
- Image-led
- Clean and spacious
- Strong typography and intentional hierarchy

The website should feel like a premium beauty/fashion storefront, not a generic SaaS dashboard and not a generic Shopify template.

## Non-negotiable brand colours

Use only the following core brand colours unless a neutral is required for accessibility or system states.

| Token | HEX | Primary use |
|---|---|---|
| `brand-burgundy` | `#4A2439` | Primary brand colour, dark sections, primary text, navigation accents |
| `brand-rose` | `#E7A7B5` | Accent, CTAs, highlights, selected states, subtle badges |
| `brand-soft-white` | `#FFFAFA` | Main light surface, light text on dark surfaces, cards/backgrounds |

### Colour rules

- Do not introduce competing brand colours such as purple, gold, orange, bright pink, or blue.
- Avoid making every section burgundy. The overall experience should breathe.
- Prefer a light/soft-white foundation with burgundy used for contrast and rose used sparingly as an accent.
- Target an approximate visual balance of 60% soft white/light neutral, 25% burgundy, 15% rose across a full page, not a rigid mathematical rule for every component.
- Do not use gradients unless they are extremely subtle and serve a clear purpose. Never use decorative AI-style gradients.
- Ensure text/background contrast is accessible. If the brand palette alone cannot provide sufficient contrast for a specific state, use a sensible neutral rather than inventing another brand colour.

## Typography

Default direction:
- Headings: elegant editorial serif such as Cormorant Garamond or Playfair Display.
- UI/body: clean sans-serif such as Inter, DM Sans, or Manrope.

Typography rules:
- Use a strong serif/sans pairing consistently.
- Large editorial headlines are encouraged in hero sections and campaign moments.
- Keep body copy short and readable.
- Avoid excessive all-caps text.
- Use font weight and size to create hierarchy rather than decorative effects.

## Layout principles

- Prioritise whitespace and clean alignment.
- Use generous section spacing.
- Use large, high-quality product/lifestyle imagery.
- Maintain a clear content hierarchy: discovery -> product -> trust -> conversion.
- Avoid excessive cards, borders, shadows, pills, and rounded containers.
- Use rounded corners only when they contribute to the brand or usability; do not round everything.
- Prefer strong editorial compositions over dense dashboard-like grids.

## Homepage composition

Recommended structure:

1. Announcement/promotion bar, optional and restrained.
2. Clean main navigation.
3. Editorial hero with a strong campaign image and one primary CTA.
4. Shop-by-category visual tiles.
5. New arrivals or featured collection.
6. Best sellers.
7. Brand story/editorial split section.
8. Hair care / beauty cross-sell section.
9. Customer reviews/social proof.
10. Social/Instagram-style content section where appropriate.
11. Newsletter/signup CTA.
12. Rich but clean footer.

Do not force every section onto every homepage. The actual content should determine the final composition.

## Navigation

Desktop navigation should be clean and restrained.

Suggested information architecture:
- Shop
- Hair
- Hair Care
- Beauty
- New In
- Sale/Specials
- About

Utility actions:
- Search
- Account
- Wishlist
- Cart

Mobile navigation must be deliberately designed, not simply collapsed desktop navigation.

## E-commerce UX

The interface must make shopping easy.

### Product discovery

Support:
- Search
- Category browsing
- Filters
- Sort
- Availability/stock states
- Price display in ZAR
- Clear product imagery
- Wishlist/favourites

### Product cards

Product cards should prioritise:
- Large product image
- Product name
- Short useful metadata
- Price
- Compare-at/sale price where relevant
- Rating where available
- Wishlist action
- Quick add only when it is genuinely useful

Do not overload cards with multiple competing buttons.

### Product detail pages

Use a premium editorial layout with:
- Large image/gallery area
- Product title
- Price
- Rating/review count
- Variant selectors
- Quantity
- Add to Bag
- Buy Now where appropriate
- Delivery information
- Product details
- Care information
- Reviews
- Related/recommended products

For hair products, support relevant variants such as length, texture, colour, density, cap size, or other product-specific options. Do not show irrelevant selectors.

### Cart

The cart should clearly show:
- Product image
- Name/variant
- Quantity controls
- Price
- Remove/save action
- Subtotal
- Delivery estimate or fee when known
- Checkout CTA

### Checkout

Prioritise trust and low friction.

Show:
- Customer details
- Delivery address
- Shipping method
- Payment method
- Order summary
- Total in ZAR
- Clear payment/submit action
- Error and validation feedback

Support guest checkout unless a business requirement explicitly prevents it.

### Account

Authenticated customers should be able to access:
- Profile
- Orders
- Order details/status
- Saved addresses
- Wishlist
- Account settings

The authentication experience should support email/password plus Google and Facebook sign-in where configured by the application.

## South African commerce considerations

- Display monetary values in South African rand (ZAR) by default.
- Design for South African delivery/address patterns.
- Payment UI must be gateway-agnostic so the implementation can integrate the selected provider without redesigning checkout.
- Clearly distinguish successful, pending, failed, cancelled, and refunded payment states.

## Image direction

Use photography that feels:
- Premium
- Authentic
- Beauty/editorial focused
- Well lit
- Texture-rich
- Product-first

Hair should be shown clearly enough to judge texture, length, density, finish, and colour where relevant.

Do not use obviously synthetic AI-looking beauty imagery as the default product representation when real product photography is available.

## Interaction and motion

Motion should be subtle and purposeful.

Good uses:
- Soft image transitions
- Product-card hover imagery
- Button/selection feedback
- Drawer/modal transitions
- Page/section reveal when restrained

Avoid:
- Excessive parallax
- Large animated gradients
- Bouncy UI everywhere
- Long loading animations
- Motion that delays shopping tasks

Respect reduced-motion preferences.

## Responsive rules

Design mobile-first.

Required checkpoints:
- ~375px mobile
- ~768px tablet
- ~1024px laptop
- Large desktop

Do not merely scale the desktop layout down.

For mobile:
- Keep primary actions reachable.
- Make product images large enough to understand.
- Use sensible sticky/fixed actions where helpful.
- Avoid tiny filter controls.
- Keep navigation simple.
- Prevent horizontal scrolling.

## Accessibility

Every page/component must consider:
- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Alt text for meaningful images
- Sufficient contrast
- Touch target sizing
- Form error messaging
- Screen-reader-friendly state changes
- Reduced motion

Do not rely on colour alone to communicate success, error, selected, or disabled states.

## Design anti-patterns

Avoid:
- Generic purple/blue AI-generated palettes
- Default Tailwind-looking pages with no brand expression
- Excessive rounded cards
- Excessive drop shadows
- Glassmorphism used without purpose
- Huge empty areas with no editorial intent
- Too many competing CTAs
- Overuse of dusty rose
- Inconsistent border radii
- Inconsistent spacing scales
- Unnecessary icons and decoration
- Dense text blocks
- Desktop-first layouts patched for mobile

## Reference handling

Pinterest, Behance, Dribbble, and other references are inspiration only.

Extract:
- Layout patterns
- Information hierarchy
- Photography composition
- Navigation patterns
- Merchandising ideas
- Interaction patterns
- Spacing and typography ideas

Do NOT copy:
- Brand identity
- Logos
- Exact artwork
- Proprietary illustrations
- Unique copy
- Exact page designs

Always translate inspiration into The Blend.Co's own visual language and colour system.

## Component consistency

Create reusable design tokens/components for:
- Navigation
- Buttons
- Links
- Form controls
- Product cards
- Category cards
- Badges
- Ratings
- Price display
- Image galleries
- Drawers/modals
- Toasts
- Empty states
- Loading states
- Error states
- Checkout sections

Avoid one-off styling that makes similar components look unrelated.

## Page review checklist

After implementing a page, review it in this order:

1. Brand: Does it clearly look like The Blend.Co?
2. Hierarchy: Can a customer understand the page within seconds?
3. E-commerce UX: Is the next shopping action obvious?
4. Typography: Are heading/body/UI roles consistent?
5. Colour: Are Burgundy/Rose/Soft White used intentionally?
6. Spacing: Are sections aligned and breathing consistently?
7. Imagery: Are products/lifestyle images doing real visual work?
8. Responsive: Does mobile have a deliberate layout?
9. Accessibility: Are keyboard, labels, focus, contrast, and states handled?
10. Polish: Remove anything that feels decorative, generic, or unnecessary.

## Definition of done

A design is not complete merely because it renders.

It is complete when:
- It follows the The Blend.Co palette and visual identity.
- It works at mobile, tablet, and desktop widths.
- The important shopping flow is obvious.
- Components are consistent and reusable.
- Loading, empty, error, selected, and disabled states exist where relevant.
- Accessibility basics are handled.
- The design has been visually reviewed against the principles above.
