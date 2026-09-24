# Architecture — SCRUM-6: Color-Code Calculator Buttons

**Source:** [requirements.md](requirements.md)
**Story:** SCRUM-6 — Enhance calculator application with proper color coding (CSS-only, no logic changes)

## Overview

This is a CSS-only visual enhancement to an existing single-component React calculator ([src/App.jsx](src/App.jsx) + [src/App.css](src/App.css)). The calculator currently renders all buttons with the same neutral style; only `.clear`, `.equals`, and `.zero` classes exist today, and those are used solely for grid-span layout, not color. Operator buttons (÷ × − +) currently have no distinguishing class at all.

The approach introduces four visually distinct button categories (digit, operator, clear, equals) driven by a small set of CSS custom properties (variables) defined once on `.calculator`, plus one new class hook (`.operator`) added in JSX so operator buttons can be targeted in CSS. No calculator logic, state, or event handlers change.

## Component List and Responsibilities

| Component/File | Responsibility | Change Type |
|---|---|---|
| [src/App.jsx](src/App.jsx) | Renders calculator markup and owns all logic (`inputNumber`, `inputOperator`, `calculate`, `handleEquals`, `handleDecimal`, `clearCalculator`). | Minimal: add `className="operator"` to the four operator buttons (÷ × − +) only. No JSX structure, props, state, or handler changes. |
| [src/App.css](src/App.css) | Owns all visual styling: layout, color, spacing, interactive states. | Primary change: add CSS custom properties (color palette) and category-specific rules for `button` (digit default), `.operator`, `.clear`, `.equals`; extend hover state; add `:focus-visible` states. |
| [src/index.css](src/index.css), [src/main.jsx](src/main.jsx) | Global bootstrap styles / React root mount. | No changes needed. |

No new files, components, or dependencies are introduced.

## Data Flow

This story has no data/state flow changes. For reference, the existing (unchanged) interaction flow is:

```
User click/keyboard activation on <button>
        │
        ▼
 Event handler in App.jsx (inputNumber / inputOperator / handleEquals / clearCalculator / handleDecimal)
        │
        ▼
 React state update (display, firstNumber, operator, waitingForSecondNumber)
        │
        ▼
 Re-render → <div className="display">{display}</div>
```

The styling layer sits entirely outside this flow: `className` values (static: `clear`, `equals`, `zero`, and the new `operator`) determine which CSS rule paints each button. No style state is held in React; all visual states (default, hover, focus-visible, active) are handled declaratively in CSS via selectors, not via JS-driven class toggling.

## Technology Choices

- **Plain CSS only** — consistent with NFR-3; no CSS-in-JS, no utility framework (e.g., Tailwind), no new npm packages.
- **CSS Custom Properties (variables)** — declared on `.calculator` (or `:root`) to hold the four category colors (and their text colors), per NFR-5, so the palette is defined once and reused via `var(--token-name)` in each category rule. This keeps future theme/palette changes to a single block of declarations.
- **Class-based targeting** — `.operator` (new), `.clear`, `.equals` (existing) as category hooks; plain `button` selector continues to serve as the digit/default style so no new class is needed for digits or `.` /decimal (they fall through to the default `button` rule, consistent with FR-1).
- **`:focus-visible`** (with a `:focus` fallback comment/rule if broader browser support is desired) for keyboard-only focus rings, avoiding a visible ring on mouse click while still satisfying FR-6/AC-5 for keyboard users.

## Proposed CSS Variable Structure (illustrative, not final values)

```css
.calculator {
  --color-digit-bg: #4a4a4a;
  --color-digit-text: #ffffff;

  --color-operator-bg: #ff9500;
  --color-operator-text: #1a1a1a; /* chosen for contrast, see A11y section */

  --color-clear-bg: #d32f2f;
  --color-clear-text: #ffffff;

  --color-equals-bg: #1565c0; /* darkened from #2979ff — see Design Review: original failed 4.5:1 AA with white text */
  --color-equals-text: #ffffff;
}

button {
  background: var(--color-digit-bg);
  color: var(--color-digit-text);
}

.operator {
  background: var(--color-operator-bg);
  color: var(--color-operator-text);
}

.clear {
  background: var(--color-clear-bg);
  color: var(--color-clear-text);
}

.equals {
  background: var(--color-equals-bg);
  color: var(--color-equals-text);
}

button:hover {
  opacity: 0.8;
}

/* :focus fallback is required (not optional) so AC-5 is met in browsers without :focus-visible support */
button:focus {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
}

button:focus:not(:focus-visible) {
  outline: none;
}

button:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
}
```

The decimal button (`.`) carries no dedicated class and intentionally falls through to the default `button` (digit) style — it is grouped visually with digit entry, consistent with FR-1's intent even though FR-1 only names digits 0–9 explicitly.

Exact hex values remain an open question per requirements.md (Open Question 1) and should be confirmed/finalized during implementation, provided they pass the contrast checks below.

## Error Handling Approach

Not applicable in the traditional sense — this is presentational CSS with no runtime logic, no data fetching, and no failure modes to catch. The only "failure" class is a visual regression (e.g., insufficient contrast or a missing focus indicator), which is mitigated by:
- Verifying contrast ratios against WCAG AA before finalizing palette values.
- Manual/automated visual + keyboard-navigation check as part of the Verify stage (Tab through all buttons, confirm hover and focus-visible states render, confirm calculation flow AC-6 still passes).

## Security Considerations

- No new attack surface is introduced: this change touches only static CSS class names and color values, with no user input, no new script execution paths, and no new dependencies.
- The pre-existing `eval()` usage in `calculate()` ([src/App.jsx](src/App.jsx)) is explicitly out of scope for this story (per requirements.md) and is left untouched; it remains a separate, already-flagged concern for the Security Remediation stage.
- No secrets, tokens, or external resources are involved in this styling change.

## Accessibility (a11y) Considerations

- **Contrast (NFR-1, WCAG 2.1 AA, ≥4.5:1 for normal text):** Each of the four category text/background pairs must be checked with a contrast calculator before finalizing hex values. Computed ratios for the illustrative palette: digit `#ffffff` on `#4a4a4a` ≈ 8.87:1 (pass); clear `#ffffff` on `#d32f2f` ≈ 4.98:1 (pass, narrow margin — re-verify if the exact hex is adjusted); operator `#1a1a1a` on `#ff9500` ≈ 7.91:1 (pass — white text on this background would fail AA, so dark text is required). The original equals pairing, `#ffffff` on `#2979ff`, measured ≈ 3.99:1 and **fails** AA; the palette above has been updated to `#ffffff` on `#1565c0` (≈ 5.75:1, pass). All values must still be re-verified numerically during implementation, not assumed from this document.
- **Focus visibility (FR-6, AC-5):** Add an explicit `:focus-visible` outline (distinct from `:hover`'s opacity dimming) so keyboard users tabbing through the grid always see which button is focused, independent of category color. Outline color/contrast should also be checked against each category background.
- **Keyboard navigation:** Buttons are native `<button>` elements, so Tab order, Enter/Space activation, and focus outlines work by default; no `tabIndex` or ARIA changes are required. This story does not add any custom interactive widgets.
- **Color is not the sole differentiator:** Button labels (digits, `÷ × − +`, `C`, `=`) already convey meaning independent of color, so color-coding is a reinforcing/enhancing cue, not the only way to distinguish button function — satisfying WCAG SC 1.4.1 (Use of Color).

## Assumptions and Constraints

- No new npm packages, CSS frameworks, or build tool changes (NFR-3); implementation stays within [src/App.css](src/App.css) and a minimal `className` addition in [src/App.jsx](src/App.jsx).
- Existing 4-column grid layout, 320px card width, and grid-spans on `.clear`/`.equals`/`.zero` are preserved exactly (NFR-4).
- No calculator logic, state shape, or event handler signatures change; the only JSX edit is adding `className="operator"` to the four operator buttons.
- Exact color palette values are not mandated by the Jira story; the palette proposed here is a placeholder aligned with requirements.md's default assumption and must still be validated for contrast before/during implementation.
- No dark/light theme toggle is introduced; the existing single dark-card design is retained (per requirements.md Open Question 2).
