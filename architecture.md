# Architecture — SCRUM-6: Color-code Calculator Buttons by Category

**Source:** [requirements.md](requirements.md)
**Story:** SCRUM-6 — Enhance the existing calculator application with proper color coding

## Overview

This is a purely presentational (CSS/JSX class-name) change to the existing single-component React calculator. No new components, state, dependencies, or build tooling are introduced. The button grid already exists in [src/App.jsx](src/App.jsx) and is styled in [src/App.css](src/App.css); the architecture adds:

1. A small set of CSS custom properties (design tokens) for the four button color categories, scoped to `.calculator` (not `:root`, to avoid leaking into global scope).
2. Category class names (`number`, `operator`) added to button JSX so CSS selectors can target each category, reusing the existing `clear` and `equals` classes (currently layout-only) and the existing `zero` class (layout-only, unchanged).
3. No changes to component structure, state, handlers, or the `calculate()` logic (including the pre-existing `eval()` usage, which is explicitly out of scope for this story).

## Impacted Components / Files

| File | Change | Notes |
|---|---|---|
| [src/App.jsx](src/App.jsx) | Add `className="number"` to the 10 digit buttons and the decimal button; add `className="operator"` to the ÷ × − + buttons | `clear`, `equals`, `zero` class names already exist and are kept; `zero` button becomes `className="number zero"` (needs both category color and existing grid-span layout) |
| [src/App.css](src/App.css) | Add `:root`/`.calculator` custom properties for the four color tokens; add `.number`, `.operator` background/text-color rules; extend `.clear` and `.equals` rules with background/text-color (their existing grid-layout rules are unchanged) | No changes to `.buttons` grid, `.display`, `body`, or `button:hover` opacity rule |
| No other files | — | No changes to [src/main.jsx](src/main.jsx), [src/index.css](src/index.css), [package.json](package.json), or build config |

## Data Flow

No data flow changes. This story is styling-only, so the existing flow is unaffected:

```
User click → onClick handler (inputNumber / inputOperator / handleEquals / clearCalculator / handleDecimal)
           → setState (display, firstNumber, operator, waitingForSecondNumber)
           → React re-render → <button> elements re-rendered with same class names/colors on every render
```

Button color is applied purely via CSS class selectors matched against static `className` values already present in JSX — it does not depend on component state, so no re-render/data-flow change is needed to support color coding.

## Technology Choices

- **Plain CSS custom properties (variables)**, defined once (e.g., inside `.calculator { ... }` or `:root`) and referenced by category selectors. This satisfies **NFR-1** (single source of truth for each color, no scattered hex literals) without adding a CSS-in-JS library, Sass, or Tailwind — consistent with the repo's existing plain-CSS convention in [src/App.css](src/App.css).
- **Class-name-based selectors** (`.number`, `.operator`, `.clear`, `.equals`) rather than inline styles or `data-*` attributes, matching the existing pattern already used for `.clear`, `.equals`, `.zero`.
- No new npm dependencies (satisfies **NFR-3**).

## Error Handling Approach

Not applicable — this is a static styling change with no new logic, network calls, async behavior, or user-input validation. Existing error handling (none currently exists around `calculate()`/`eval()`) is untouched and out of scope per requirements.

## Security Considerations

- No new attack surface is introduced: no new dependencies, no new user input parsing, no dynamic class-name construction from untrusted data (all class names are static string literals in JSX).
- The pre-existing `eval()`-based `calculate()` function (CWE-95) is explicitly out of scope for this story per requirements.md and is **not** modified.
- CSS custom properties and static class names carry no injection risk since no user-supplied values flow into styles or class attributes.

## Styling / Structure Approach

1. **Tokens (CSS custom properties)** — declared once in [src/App.css](src/App.css), scoped to `.calculator` so they don't leak globally:
   - `--color-number-bg`, `--color-number-text`
   - `--color-operator-bg`, `--color-operator-text`
   - `--color-equals-bg`, `--color-equals-text`
   - `--color-clear-bg`, `--color-clear-text`
2. **Category classes**:
   - `.number` → number/decimal buttons (background: number token)
   - `.operator` → ÷ × − + buttons (background: operator accent token)
   - `.equals` → existing class, extended with equals accent token (grid-row span rule kept as-is)
   - `.clear` → existing class, extended with red token (grid-column span rule kept as-is)
   - `.zero` → existing class, layout-only (`grid-column: span 2`); combined with `.number` on the same element for color
3. Base `button { ... }` rule (height, border-radius, font-size, cursor) and `button:hover { opacity: 0.8; }` remain unchanged and continue to apply globally to all buttons regardless of category, preserving **FR-5 / AC-5**.
4. Text color is set per category (light text on all dark-accent backgrounds) to keep contrast reasonable without introducing new a11y requirements.

## Proposed Color Tokens

Chosen to be clearly distinct from each other and from the existing dark theme (`#222` calculator background, `#111` display background), while keeping a cohesive dark-UI palette:

| Category | Custom property | Value | Text color | Approx. contrast (bg vs. text) |
|---|---|---|---|---|
| Numbers (neutral) | `--color-number-bg` | `#3a3a3c` (neutral dark gray, lighter than `#222`/`#111`) | `--color-number-text: #f5f5f5` | ~10.4:1 |
| Operators (shared accent) | `--color-operator-bg` | `#ff9f0a` (amber/orange) | `--color-operator-text: #1a1a1a` | ~8.5:1 |
| Equals (distinct accent) | `--color-equals-bg` | `#0066cc` (blue, darkened from initial `#0a84ff` proposal) | `--color-equals-text: #ffffff` | ~5.6:1 |
| Clear (destructive/red) | `--color-clear-bg` | `#d32f2f` (red, darkened from initial `#ff3b30` proposal) | `--color-clear-text: #ffffff` | ~5.0:1 |

These four hex values are mutually distinct and distinct from `#222`/`#111`, satisfying **FR-1–FR-4** and **NFR-2**. The equals and clear background values were darkened during Design Review (see design-review.md) so white text meets the WCAG AA 4.5:1 normal-text contrast threshold — the original `#0a84ff`/`#ff3b30` proposals measured ~3.9:1 and ~3.6:1 respectively. This is an informational improvement only; formal WCAG verification remains out of scope per requirements.md.

## Accessibility (a11y) Considerations

Per repo gate policy, a11y must be addressed even when the story explicitly excludes new a11y/contrast requirements:

- **No regression**: existing keyboard focus behavior (native `<button>` focus outline) and existing hover/opacity interaction are not removed or overridden by the new color rules — no `outline: none` or `:focus` overrides are introduced.
- **Contrast note (informational only, not a new AC)**: chosen text colors (`#f5f5f5`, `#1a1a1a`, `#ffffff`) against their respective backgrounds provide reasonably high contrast as a side effect of the token choices (all four category combinations estimate at or above ~5:1, see Proposed Color Tokens table), but no formal WCAG contrast verification is performed or required for this story, per requirements.md.
- **No semantic changes**: button elements, their text content, and `onClick` handlers are unchanged, so screen-reader behavior is unaffected.

## Assumptions / Constraints

- Exact hex values were not specified in the Jira story; the four tokens above are proposed here per requirements.md's deferral to the Architecture stage and are subject to Design Review adjustment.
- No distinction is made among the four individual operator symbols (÷ × − +) — they share one accent color, per resolved open question.
- Layout (`grid-template-columns`, `grid-column`/`grid-row` spans for `.clear`, `.equals`, `.zero`) is unchanged (**NFR-3**).
- No new dependencies, build config, or component structure changes are introduced.
- The `eval()`-based calculation vulnerability is out of scope and untouched.
