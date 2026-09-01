# Design Review: SCRUM-6 Color-Coded Calculator Controls

## Summary

The proposed approach is appropriately limited to semantic button category classes in `src/App.jsx` and centralized presentation rules in `src/App.css`. It preserves calculator behavior, the existing grid layout, native button semantics, and the no-dependency constraint.

Architecture update required: **No.** The architecture already identifies the affected files, category mapping, CSS custom-property approach, interaction states, and accessibility expectations. This review resolves the deferred visual decisions for implementation planning.

## Strengths

- The UI classification maps directly to the story's four required control purposes: numeric entry, arithmetic operations, clear, and result evaluation.
- Presentation changes are isolated from calculator state and calculation handlers, minimizing regression risk.
- Retaining the existing `clear`, `equals`, and `zero` layout classes protects the current grid spans.
- Native `<button>` elements and visible labels/symbols preserve accessible names and keyboard activation.
- CSS custom properties provide a maintainable way to keep category treatments consistent.

## Risks/Gaps

| Severity | Risk / gap | Mitigation |
| --- | --- | --- |
| High | The current global `button:hover { opacity: 0.8; }` treatment can reduce text contrast and conflicts with the requirement for category-specific interaction states. | Replace or override it with explicit category hover colors that retain readable foreground contrast. |
| High | The current button rule has no `:focus-visible` styling, leaving keyboard focus indistinct. | Use a consistent, high-contrast focus ring on every calculator button: `3px solid #111827` with `3px` offset; do not remove browser focus without this replacement. |
| Medium | The proposed architecture says to use sufficient contrast but does not define palette values or a measurable target. | Implement the approved palette below and retain at least WCAG 2.1 AA $4.5:1$ text contrast for normal-sized label text in default, hover, and active states. |
| Medium | Button colors alone could be interpreted as the only category indicator. | Preserve the visible button text and mathematical symbols exactly as rendered today; classes are non-semantic styling hooks only. |
| Low | Adding category classes could accidentally replace the existing span classes and alter the grid. | Compose category and layout classes on `C`, `=`, and `0`; do not change button ordering, dimensions, handlers, or grid selectors. |
| Low | Color changes may look acceptable at one size but lose clarity on smaller viewports. | Verify default, hover, active, and focused states at the current desktop layout and a narrow viewport; labels must remain visible and controls must not resize. |

## Decisions

1. **Category palette:** use a cool neutral numeric baseline with distinct semantic accents, selected to remain legible against the existing charcoal calculator shell:

   | Category | CSS token prefix | Default | Hover | Active | Foreground |
   | --- | --- | --- | --- | --- | --- |
   | Numeric entry, including decimal | `--number-*` | `#E5E7EB` | `#D1D5DB` | `#9CA3AF` | `#111827` |
   | Arithmetic operation | `--operator-*` | `#0F766E` | `#115E59` | `#134E4A` | `#FFFFFF` |
   | Clear | `--clear-*` | `#B91C1C` | `#991B1B` | `#7F1D1D` | `#FFFFFF` |
   | Result evaluation | `--equals-*` | `#1D4ED8` | `#1E40AF` | `#1E3A8A` | `#FFFFFF` |

2. **State treatment:** each category receives explicit `background-color` values for default, `:hover`, and `:active`; active state may use a small `transform: translateY(1px)` only if it does not shift grid sizing.

3. **Focus treatment:** all buttons use the same `:focus-visible` ring, `outline: 3px solid #111827; outline-offset: 3px;`. This is intentionally independent of category color and remains visible against both light numeric and saturated action controls.

4. **Control mapping:** digits `0` through `9` and `.` are numeric; `÷`, `×`, `−`, and `+` are operators; `C` is clear; `=` is result evaluation. Existing layout classes remain in addition to the category class.

5. **Responsive treatment:** the palette changes colors only. It must not modify the existing button height, grid columns, spans, font size, or label visibility.

## Action Items

- Implementation Planning: specify the exact category class names and CSS selectors based on the approved mapping.
- Implementation: define the listed color values as centralized CSS custom properties and replace the generic opacity hover behavior with category-specific states.
- Implementation: add and visually verify a consistent `:focus-visible` outline for every calculator button.
- Verification: exercise number, decimal, operator, clear, and equals controls with pointer and keyboard activation; check focused and active states at desktop and narrow viewport widths.

## Gate Outcome

**Gate 3 passed.** `design-review.md` records strengths, concrete palette and accessibility decisions, risks with severity and mitigation, and action items. `architecture.md` does not require an update.
