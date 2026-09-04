# The Blend.Co — frontend-design project rules

Use Anthropic's `frontend-design` skill as the implementation baseline. These project rules refine it for this brand.

## Priority order

1. The Blend.Co brand identity and colour rules in `.claude/skills/the-blend-design-system/SKILL.md`.
2. Usability and accessibility.
3. E-commerce conversion and clarity.
4. Editorial/premium visual expression.
5. Decorative details.

## Before building

First identify:
- page purpose
- primary customer action
- required content
- reusable components
- responsive behaviour
- relevant product states

Do not start by decorating a generic template.

## Visual direction

Build an editorial luxury beauty storefront using:
- `#4A2439` Deep Burgundy
- `#E7A7B5` Dusty Rose
- `#FFFAFA` Soft White

Use the brand palette as the visual anchor even when taking structural inspiration from external references.

## Implementation expectations

- Prefer clean, maintainable React components.
- Use the existing project design system/tokens rather than introducing ad-hoc colours.
- Keep visual spacing systematic.
- Make interactions feel deliberate and lightweight.
- Keep product imagery prominent.
- Do not introduce framework demo components merely to fill space.

## Self-critique after implementation

Before considering a page complete, inspect it as a customer and as a designer:

### Customer review
- What do I buy here?
- Where do I click next?
- Can I find a product quickly?
- Is the price obvious?
- Is checkout trustworthy?

### Design review
- Does the page look generic?
- Is Burgundy doing enough brand work without overwhelming the page?
- Is Dusty Rose an accent rather than the entire colour story?
- Is Soft White creating enough breathing room?
- Are there unnecessary cards, borders, shadows, pills, or animations?
- Is the typography distinctive and consistent?

### Responsive review
- Test ~375px, ~768px, ~1024px, and desktop.
- Check navigation, product grids, filters, forms, modals/drawers, and checkout.
- Fix overflow and awkward wrapping instead of hiding problems.

## Do not

- Copy Pinterest designs exactly.
- Add random colours to solve a visual problem.
- Build a landing page when the requirement is an e-commerce flow.
- Treat mobile as an afterthought.
- Call a page finished without checking loading, empty, error, and disabled states.
