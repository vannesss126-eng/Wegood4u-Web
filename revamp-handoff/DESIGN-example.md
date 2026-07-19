
# Design System Inspired by SayShej

## 1. Visual Theme & Atmosphere

SayShej embodies a minimalist, contemplative aesthetic rooted in clarity and purposeful restraint. The design philosophy prioritizes content immersion through generous whitespace and deliberate typographic hierarchy, creating an environment that feels both sophisticated and accessible. The monochromatic foundation conveys professionalism and timelessness, allowing the focus to rest entirely on the substance of communication. This is a design system built for thoughtful engagement—eschewing ornament in favor of pure functionality and visual honesty.

**Key Characteristics**

- Monochromatic palette with black as the primary communicative element
- Extensive use of whitespace and negative space for breathing room
- Clean, hierarchical typography with precise sizing relationships
- Minimal border treatments and subtle visual boundaries
- Purpose-driven layout that prioritizes content clarity
- High contrast for maximum readability and accessibility
- Understated elegance through restraint rather than decoration

## 2. Color Palette & Roles

### Primary

- **Black** (`#000000`): Primary text, headings, and primary interactive elements. Establishes the core visual language and ensures maximum contrast against light backgrounds.

### Neutral Scale

- **White** (`#FFFFFF`): Primary background and surface color. Provides the canvas for all content and establishes the light aesthetic foundation.
- **Off-White / Light Gray** (`#F5F5F5`): Secondary background for subtle surface differentiation, card backgrounds, and section divisions. Used sparingly to maintain the minimalist approach.
- **Medium Gray** (`#808080`): Disabled states, secondary text, and de-emphasized content. Creates visual hierarchy without introducing additional colors.
- **Dark Gray** (`#333333`): Alternative heading color for lighter contrast situations or secondary emphasis.

### Interactive

- **Black Link** (`#000000`): Underlined text links maintaining system consistency. Hover state introduces underline opacity or weight variation.
- **Black Button Primary** (`#000000`): Primary call-to-action buttons with black background. Text rendered in white for maximum contrast.

### Surface & Borders

- **Light Border** (`#CCCCCC`): Subtle dividing lines, card borders, and rule elements. Maintains minimalist aesthetic while providing necessary visual separation.
- **Subtle Background** (`#FAFAFA`): Barely perceptible background tint for contained sections, preventing complete flatness while respecting the whitespace philosophy.

## 3. Typography Rules

### Font Family

**Primary Font:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`

- Provides native platform rendering with consistent humanist sans-serif aesthetic across operating systems.

**Secondary Font (Code):** `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`

- Ensures legible code blocks and technical content display.

### Hierarchy

| Role         | Font      | Size | Weight | Line Height | Letter Spacing | Notes                                    |
| ------------ | --------- | ---- | ------ | ----------- | -------------- | ---------------------------------------- |
| Display      | Primary   | 48px | 600    | 1.2         | -0.5px         | Hero titles and major page headers       |
| H1 Heading   | Primary   | 36px | 600    | 1.3         | -0.3px         | Primary section headings                 |
| H2 Heading   | Primary   | 28px | 600    | 1.35        | 0px            | Secondary section headings               |
| H3 Heading   | Primary   | 24px | 500    | 1.4         | 0px            | Tertiary headings and subheadings        |
| H4 Heading   | Primary   | 20px | 500    | 1.45        | 0px            | Minor section headers                    |
| Body Large   | Primary   | 18px | 400    | 1.6         | 0px            | Prominent body text and introductions    |
| Body Regular | Primary   | 16px | 400    | 1.6         | 0px            | Standard paragraph and body content      |
| Body Small   | Primary   | 14px | 400    | 1.5         | 0px            | Secondary descriptive text and labels    |
| Caption      | Primary   | 12px | 400    | 1.5         | 0.5px          | Meta information, dates, and footnotes   |
| Code Block   | Secondary | 14px | 400    | 1.6         | 0px            | Preformatted code and technical snippets |
| Code Inline  | Secondary | 13px | 400    | 1.4         | 0px            | Inline code references within text       |
| Button       | Primary   | 16px | 500    | 1.5         | 0.25px         | Interactive button text                  |
| Link         | Primary   | 16px | 400    | 1.6         | 0px            | Hyperlink text, underlined               |

### Principles

- **Contrast-Driven:** Typography relies on size, weight, and spacing rather than color variation to establish hierarchy.
- **Generous Line Height:** All body text maintains 1.5x or greater line height for optimal readability and visual comfort.
- **Vertical Rhythm:** Maintain consistent baseline alignment using `4px` increments as a foundation.
- **Reduced Letter Spacing:** Negative letter spacing on large headings (displays and H1) tightens the composition and creates visual impact.
- **Weight Restraint:** Limited to 400 (regular) and 500/600 (medium/semibold) to prevent visual noise.
- **Size Relationships:** Typography scales follow a consistent mathematical progression (approximately 1.15 ratio between consecutive sizes).

## 4. Component Stylings

### Buttons

#### Primary Button

- **Background:** `#000000`
- **Text Color:** `#FFFFFF`
- **Padding:** `12px 24px`
- **Border:** none
- **Border Radius:** `2px`
- **Font Size:** `16px`
- **Font Weight:** `500`
- **Cursor:** `pointer`
- **Transition:** `background-color 0.2s ease, box-shadow 0.2s ease`
- **Hover State:** Background `#1A1A1A`, subtle lift via `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)`
- **Active State:** Background `#000000`, `box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3)`
- **Disabled State:** Background `#CCCCCC`, Text Color `#999999`, Cursor `not-allowed`

#### Secondary Button

- **Background:** `transparent`
- **Text Color:** `#000000`
- **Padding:** `12px 24px`
- **Border:** `1px solid #000000`
- **Border Radius:** `2px`
- **Font Size:** `16px`
- **Font Weight:** `500`
- **Cursor:** `pointer`
- **Transition:** `all 0.2s ease`
- **Hover State:** Background `#F5F5F5`, Border `#000000`
- **Active State:** Background `#EEEEEE`, Border `#000000`
- **Disabled State:** Border `#CCCCCC`, Text Color `#999999`, Cursor `not-allowed`

#### Ghost Button

- **Background:** `transparent`
- **Text Color:** `#000000`
- **Padding:** `12px 24px`
- **Border:** none
- **Border Radius:** `2px`
- **Font Size:** `16px`
- **Font Weight:** `500`
- **Text Decoration:** `underline`
- **Cursor:** `pointer`
- **Transition:** `opacity 0.2s ease`
- **Hover State:** Opacity `0.7`, Text Decoration remains underline
- **Active State:** Opacity `0.5`
- **Disabled State:** Opacity `0.4`, Cursor `not-allowed`

### Cards & Containers

#### Card

- **Background:** `#FFFFFF`
- **Border:** `1px solid #E0E0E0`
- **Border Radius:** `2px`
- **Padding:** `24px`
- **Box Shadow:** `0 1px 3px rgba(0, 0, 0, 0.08)`
- **Transition:** `box-shadow 0.2s ease, border-color 0.2s ease`
- **Hover State:** Box Shadow `0 4px 12px rgba(0, 0, 0, 0.12)`, Border Color `#CCCCCC`

#### Container / Section

- **Background:** `#FAFAFA`
- **Padding:** `48px 24px`
- **Margin:** `0`
- **Max Width:** `1200px` (centered with auto margins)
- **Border:** none

### Inputs & Forms

#### Text Input

- **Background:** `#FFFFFF`
- **Border:** `1px solid #CCCCCC`
- **Border Radius:** `2px`
- **Padding:** `10px 12px`
- **Font Size:** `16px`
- **Font Family:** `Primary`
- **Color:** `#000000`
- **Transition:** `border-color 0.2s ease, box-shadow 0.2s ease`
- **Focus State:** Border Color `#000000`, Box Shadow `0 0 0 3px rgba(0, 0, 0, 0.1)`
- **Disabled State:** Background `#F5F5F5`, Border Color `#DDDDDD`, Color `#999999`

#### Text Area

- **Background:** `#FFFFFF`
- **Border:** `1px solid #CCCCCC`
- **Border Radius:** `2px`
- **Padding:** `12px`
- **Font Size:** `16px`
- **Font Family:** `Primary`
- **Color:** `#000000`
- **Line Height:** `1.6`
- **Resize:** `vertical`
- **Transition:** `border-color 0.2s ease, box-shadow 0.2s ease`
- **Focus State:** Border Color `#000000`, Box Shadow `0 0 0 3px rgba(0, 0, 0, 0.1)`

#### Label

- **Font Size:** `14px`
- **Font Weight:** `500`
- **Color:** `#000000`
- **Margin Bottom:** `6px`
- **Display:** `block`

#### Form Helper Text

- **Font Size:** `12px`
- **Color:** `#666666`
- **Margin Top:** `4px`
- **Display:** `block`

### Navigation

#### Primary Navigation Bar

- **Background:** `#FFFFFF`
- **Border Bottom:** `1px solid #E0E0E0`
- **Padding:** `16px 24px`
- **Position:** `sticky` or `fixed` (context-dependent)
- **Top:** `0`
- **Z Index:** `100`

#### Navigation Link (Active)

- **Color:** `#000000`
- **Font Size:** `16px`
- **Font Weight:** `500`
- **Text Decoration:** `underline`
- **Padding:** `8px 0`
- **Transition:** `color 0.2s ease, text-decoration 0.2s ease`

#### Navigation Link (Inactive)

- **Color:** `#666666`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Text Decoration:** `none`
- **Padding:** `8px 0`
- **Transition:** `color 0.2s ease`
- **Hover State:** Color `#000000`

### Links

#### Text Link

- **Color:** `#000000`
- **Text Decoration:** `underline`
- **Font Size:** Inherits from parent
- **Font Weight:** `400`
- **Cursor:** `pointer`
- **Transition:** `opacity 0.2s ease`
- **Hover State:** Opacity `0.7`
- **Visited State:** Color `#333333`

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px`

**Spacing Scale:**

- `4px` (0.25rem): Tight spacing between inline elements
- `8px` (0.5rem): Compact spacing for form fields, small gaps
- `12px` (0.75rem): Default spacing between form controls
- `16px` (1rem): Standard spacing between content blocks
- `24px` (1.5rem): Generous spacing between sections
- `32px` (2rem): Major section separation
- `48px` (3rem): Page section padding and large breaks
- `64px` (4rem): Hero and full-bleed section padding
- `80px` (5rem): Extra large compositional breathing room

**Usage Context:**

- Card padding: `24px`
- Section padding: `48px vertical`, `24px horizontal`
- Margin between list items: `16px`
- Gap between form fields: `24px`
- Paragraph margin bottom: `16px`

### Grid & Container

- **Maximum Container Width:** `1200px`
- **Horizontal Padding:** `24px` (maintained at all breakpoints above 640px)
- **Column Strategy:** 12-column flexible grid, adaptable to content flow
- **Section Pattern:** Full-width containers with centered content up to `1200px`
- **Hero Full Bleed:** Content extends edge-to-edge on mobile, centered container on desktop
- **Nested Containers:** Secondary containers maintain `24px` internal padding

### Whitespace Philosophy

The design system privileges silence over decoration. Whitespace is treated as an active design element that creates visual hierarchy, improves cognitive processing, and establishes a sense of calm and professionalism. Every section breathing room is intentional, preventing visual fatigue while guiding the eye through content priority. Margins and padding follow the established scale rigorously, avoiding arbitrary spacing decisions that fragment the visual rhythm.

### Border Radius Scale

- **No Radius (Sharp):** `0px` – Primary treatment for buttons, inputs, and card elements. Emphasizes precision and minimalism.
- **Minimal Radius:** `2px` – Applied to all interactive components (buttons, cards, inputs) for subtle softening without compromising geometric clarity.
- **Small Radius:** `4px` – Reserved for nested elements, badges, or accent components requiring slightly more personality.
- **Medium Radius:** `6px` – Used on larger modals or overlay containers for softer visual treatment.
- **Large Radius:** `8px` – Applied to full-bleed hero sections or major layout containers on select implementations.

## 6. Depth & Elevation

| Level              | Treatment                                      | Use                                                                 |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------------------- |
| Flat (Level 0)     | No shadow                                      | Default text, backgrounds, and flat content areas                   |
| Subtle (Level 1)   | `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)`  | Cards, containers, and subtle surface differentiation               |
| Raised (Level 2)   | `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12)` | Hovered cards, active overlays, and moderate elevation              |
| Elevated (Level 3) | `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15)` | Modals, dropdowns, and significant layering                         |
| Floating (Level 4) | `box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2)` | Maximum elevation for floating action buttons and critical overlays |

**Shadow Philosophy**

Depth is achieved through restrained use of shadows that maintain the minimalist aesthetic. Shadows employ soft, diffuse rendering over sharp or defined edges, creating a sense of gentle elevation rather than dramatic layering. The color of all shadows remains pure black with graduated opacity to allow underlying surfaces to remain visible and maintain visual coherence. Shadows increase proportionally with interaction state (hover, active, focus) to provide clear feedback without introducing additional visual elements.

## 7. Do's and Don'ts

### Do

- **Use the monochromatic palette consistently.** Black, grays, and white establish the design system's authority. Avoid introducing additional colors without strategic justification.
- **Maintain generous whitespace around content.** Padding and margins follow the established `4px` scale rigorously. Empty space is a feature, not wasted opportunity.
- **Employ typography hierarchy with precision.** Rely on size, weight, and line height rather than color variation to establish visual order. Every heading and body size has a defined purpose.
- **Apply minimal border treatments.** Use `1px solid` borders at `#CCCCCC` or `#E0E0E0` sparingly. Prefer whitespace and shadow for separation.
- **Keep components simple and functional.** Buttons, inputs, and cards prioritize clarity over ornamentation. Rounded corners remain at `2px`; decoration is restrained.
- **Test for accessibility.** Ensure all text meets WCAG AA contrast ratios (black on white achieves 21:1). Maintain adequate touch targets for interactive elements.
- **Adapt layouts flexibly but maintain principles.** Responsive design scales content and spacing proportionally while preserving the minimalist aesthetic.

### Don't

- **Introduce color beyond the defined palette.** Gradients, vibrant accents, or decorative colors fragment the visual language. Resist the impulse to add color for emphasis.
- **Apply excessive shadows.** Depth should feel subtle and natural. Shadows should enhance, not dominate. Avoid stacking multiple shadow layers.
- **Overuse font weights.** Limit typography to 400 (regular) and 500/600 (medium/semibold). Avoid bold variants unless explicitly required for visual hierarchy.
- **Compress whitespace arbitrarily.** Padding and margins serve communication. Tight spacing creates visual noise and reduces readability. Respect the spacing scale.
- **Introduce decorative elements.** Icons, illustrations, and ornamental flourishes are inconsistent with the minimalist philosophy. Every visual element must serve a functional purpose.
- **Mix border radius scales inconsistently.** All interactive elements maintain `2px` border radius. Avoid varying radii across similar components.
- **Ignore typography line height principles.** Body text must maintain 1.5x or greater line height. Compressed line height compromises readability and violates the design system's accessibility commitment.
- **Create ambiguous interactive states.** Hover, active, focus, and disabled states must be clearly distinguishable through shadow, opacity, or color shifts.

## 8. Responsive Behavior

### Breakpoints

| Name          | Width         | Key Changes                                                                                                 |
| ------------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| Mobile        | 320px–639px  | Single column layout,`16px` horizontal padding, heading sizes reduced 8–16%, full-width cards            |
| Tablet        | 640px–1023px | Two-column grid,`24px` horizontal padding, standard heading sizes restored, container max-width `800px` |
| Desktop       | 1024px+       | Full 12-column grid,`24px` horizontal padding, max-width `1200px`, multi-column layouts enabled         |
| Large Desktop | 1440px+       | Increased max-width to`1280px`, expanded hero padding to `64px`, larger typography scale (+2px)         |

### Touch Targets

- **Minimum Touch Target Size:** `44px × 44px` (WCAG AAA compliant)
- **Spacing Between Targets:** `8px` minimum to prevent accidental adjacent taps
- **Button Padding:** Mobile: `12px 20px` (height ≥ 44px), Desktop: `12px 24px`
- **Link Padding:** Apply `8px` vertical and horizontal padding to ensure adequate touch target even on text links
- **Form Input Height:** Minimum `40px` to ensure thumb-friendly interaction

### Collapsing Strategy

- **Hero Sections:** Scale proportionally; padding reduces from `64px` to `32px` on mobile, heading sizes decrease by 8–12px.
- **Multi-Column Layouts:** Collapse from 12-column to 2-column (tablets) to 1-column (mobile). Maintain `24px` gutters where possible, reduce to `16px` on phones.
- **Navigation:** Sticky header on all devices; on mobile, consider collapsing into hamburger navigation if multiple items exceed available width.
- **Cards:** Maintain full width on mobile with `16px` padding, expand to constrained width with `24px` padding on tablets and desktop.
- **Spacing:** Reduce `48px` section padding to `32px` on tablets, `24px` on mobile. Maintain `16px` spacing between paragraphs across all sizes.
- **Typography:** Reduce display sizes from `48px` (desktop) to `36px` (tablet) to `28px` (mobile) while maintaining line height and weight consistency.
- **Images & Media:** Scale proportionally to container; maintain aspect ratios and apply `border-radius: 2px` consistently.

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary Text & Headings:** Black (`#000000`)
- **Primary Button CTA:** Black Background (`#000000`) with white text (`#FFFFFF`)
- **Secondary Button:** Transparent background with black border (`#000000`) and black text
- **Link Color:** Black (`#000000`), underlined
- **Background / Surfaces:** White (`#FFFFFF`)
- **Surface Hover / Card Backgrounds:** Off-White (`#F5F5F5`)
- **Borders & Dividers:** Light Gray (`#CCCCCC`) or Medium Gray (`#E0E0E0`)
- **Disabled States:** Medium Gray (`#CCCCCC`) or text Gray (`#999999`)
- **Secondary Text:** Dark Gray (`#666666`)

### Iteration Guide

1. **Monochromatic Foundation:** All interactive and textual elements derive from black (`#000000`), white (`#FFFFFF`), and gray scale. No additional colors are introduced; visual hierarchy is achieved through size, weight, spacing, and shadow.
2. **Typography Precision:** Body text is `16px` with `1.6` line height; headings follow the established size hierarchy (`48px` display, `36px` H1, `28px` H2, etc.) with 600 weight on large sizes and 500 on secondary headings. All font sizes are explicit pixel values.
3. **Spacing Consistency:** Base unit is `4px`. Padding uses multiples (`8px`, `12px`, `16px`, `24px`, `32px`, `48px`). Cards maintain `24px` internal padding; sections maintain `48px` vertical padding. Margins between block elements are `16px` or `24px` depending on hierarchy level.
4. **Border Radius Uniformity:** All interactive components (buttons, inputs, cards) use `2px` border-radius. No exceptions to this rule ensure consistent visual language. Hover states apply shadow elevation rather than radius changes.
5. **Shadow Restraint:** Shadows follow the defined elevation levels. Default cards use `0 1px 3px rgba(0, 0, 0, 0.08)`; hovered states escalate to `0 4px 12px rgba(0, 0, 0, 0.12)`. Modals and overlays use `0 8px 24px rgba(0, 0, 0, 0.15)`. No component receives multiple overlapping shadows.
6. **Button Variants:** Primary buttons are black with white text, secondary buttons are transparent with black borders and black text, and ghost buttons are transparent with underlined black text. All include hover and active states. Padding is uniform at `12px 24px` across all variants.
7. **Form Styling:** Inputs and textareas have `1px solid #CCCCCC` borders with `2px` border-radius. Focus states add `0 0 0 3px rgba(0, 0, 0, 0.1)` box-shadow. Labels are `14px` with `500` weight and `6px` margin-bottom. Helper text is `12px` gray at `#666666`.
8. **Responsive Collapse:** Horizontal padding remains `24px` on tablets/desktop but reduces to `16px` on mobile. Typography scales proportionally: display sizes reduce from `48px` to `28px` on mobile. Single-column layouts apply to devices below 640px; 12-column grids expand above 1024px. All spacing scales maintain the `4px` multiple system.
9. **Accessibility Standards:** All text achieves minimum 21:1 contrast (black on white). Touch targets are minimum `44px × 44px`. Focus states include visible ring or shadow. Disabled states have reduced opacity (`0.5` to `0.4`) and `cursor: not-allowed`. Links are underlined and distinguishable from body text through text-decoration.
10. **Implementation Directive:** Every pixel value, color code, and CSS property provided in this document is exact and must be applied as specified. Deviation from the typography hierarchy, spacing scale, color palette, or component styling introduces visual fragmentation. The system is designed for AI implementation without interpretation or creative modification.
