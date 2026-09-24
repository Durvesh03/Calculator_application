# Architecture — SCRUM-6: Calculator Button Color Coding

**Input:** `requirements.md` (SCRUM-6 — "Enhance Calculator application" with proper color coding)
**Note on process:** This is a small, fully-specified, CSS-only styling change. All open questions in
`requirements.md` are already resolved (standard calculator color convention; WCAG AA as a best-effort
goal, not a hard gate; single fixed palette; no new dependencies; no logic changes). Given that scope and
clarity, this document proposes the architecture directly rather than pausing to request additional input.

## Overview

The calculator is a single-page React (Vite) app with one component (`App` in `src/App.jsx`) that renders
a display and an 18-button grid, styled entirely by `src/App.css`. Currently every button shares one
generic style (`button { ... }`) plus three structural-only modifier classes (`.clear`, `.equals`, `.zero`)
that control grid span, not color.

The proposed solution is a **CSS-only, additive styling layer**: introduce category-based CSS classes for
the four button categories (digit/decimal, operator, clear, equals), apply them to the existing JSX
elements as plain `className` additions (no new elements, no state, no logic changes), and define
category colors plus hover/focus treatments in `App.css`. The existing structural classes (`.clear`,
`.equals`, `.zero`) are preserved as-is for layout; category classes are added alongside them for color.

No new components, files, or dependencies are introduced. The change is confined to two existing files:
`src/App.jsx` (class name attributes only) and `src/App.css` (new/updated rules).

## Component List with Responsibilities

Since this is a single-component app, "components" here refers to the logical UI regions inside `App.jsx`,
each mapped to its current and proposed styling responsibility:

| Component / Region | File | Current Responsibility | Change in Scope |
|---|---|---|---|
| `App` (root component) | `src/App.jsx` | Owns calculator state (`display`, `firstNumber`, `operator`, `waitingForSecondNumber`) and all handlers (`inputNumber`, `inputOperator`, `calculate`, `handleEquals`, `clearCalculator`, `handleDecimal`). | **No change.** No state, handler, or logic edits. |
| `.calculator` container | `src/App.css` | Card chrome: width, margin, padding, background, border-radius. | No change. |
| `.display` | `src/App.css` | Shows current display value; dark background, white text, right-aligned. | No change. |
| `.buttons` grid | `src/App.css` | 4-column CSS grid layout wrapper. | No change (layout untouched per NFR-3). |
| **Digit/decimal buttons** (`0`–`9`, `.`) | `src/App.jsx` (buttons currently with no extra class, plus `.zero`) | Render numeric/decimal input buttons. | Add a shared category class (e.g. `digit`) to each digit and decimal button (kept alongside `.zero` where present) so `App.css` can target them as one visually consistent group (FR-1, AC-1). |
| **Operator buttons** (`÷`, `×`, `−`, `+`) | `src/App.jsx` (currently no extra class) | Render the four arithmetic operator buttons. | Add a shared category class (e.g. `operator`) to each so they render in one consistent, distinct color (FR-2, AC-2). |
| **Clear button** (`C`) | `src/App.jsx` (`.clear`) | Resets calculator state. | **Decision (post-design-review):** reuse `.clear` directly for color (no second class) — it already uniquely targets exactly one button, so overloading it for both grid span and color keeps the change minimal without a real separation-of-concerns cost. Distinct from digit/operator/equals (FR-3, AC-3). |
| **Equals button** (`=`) | `src/App.jsx` (`.equals`) | Triggers `handleEquals`. | **Decision (post-design-review):** reuse `.equals` directly for color (same rationale as `.clear` above), distinct from the other three categories (FR-4, AC-4). |
| **Hover state** | `src/App.css` (`button:hover`) | Uniform `opacity: 0.8` feedback for all buttons. | Preserved for all categories (FR-5, AC-5); optionally refined per-category (e.g., a slightly darker/lighter shade) as long as visible hover feedback remains on every button. See new **Accessibility Considerations** section for the paired `:focus-visible`/`:active` treatment added during design review. |

## Data Flow

This change has **no data flow impact** — it is a pure presentation-layer change. State and event flow
remain exactly as today:

```
User click
   │
   ▼
Button onClick handler (inputNumber / inputOperator / handleEquals / clearCalculator / handleDecimal)
   │
   ▼
App component state (display, firstNumber, operator, waitingForSecondNumber)
   │
   ▼
Re-render of .display and .buttons
   │
   ▼
CSS applies category class → background-color / color / hover style
   (digit | operator | clear | equals)
```

The only thing the color-coding work adds to this flow is the last step: which CSS class(es) a given
`<button>` element carries, resolved purely by the browser's style cascade — no JS reads or writes any
color-related state.

## Technology Choices

- **Plain CSS** (existing `src/App.css`), using standard `background-color` / `color` declarations per
  class selector — no CSS-in-JS, no CSS Modules, no Tailwind/other framework (NFR-2).
- **CSS custom properties (variables)** defined once on `:root` (**decision, post-design-review**: `:root`
  rather than `.calculator`, since there is a single global fixed palette with no per-instance theming need,
  so global scope is simpler and unambiguous) for each category color and its hover/focus/active/text-contrast
  variants, then referenced by the category classes. This keeps the palette centralized and easy to adjust
  without hunting through multiple rules, while remaining plain CSS (no build-tooling or dependency change).
- **Existing React `className` mechanism** in `src/App.jsx` — category classes are added as static strings
  on JSX elements (no new props, no conditional class logic needed since categories are fixed per button).
  Where a button already carries a structural class (`.zero`), the category class is appended as a second,
  space-separated token in the same `className` string (e.g. `className="zero digit"`), not a replacement.
- No new npm packages, no new files beyond documentation artifacts (`architecture.md` itself). Consistent
  with NFR-2 and the guardrail against new dependencies.

## Error Handling Approach

This is a styling-only change with no new runtime logic, so there are no new failure modes to handle
programmatically. Applicable "error handling" is limited to build/lint/visual regression safety:

- **Build/lint safety (NFR-4):** Since only class names and CSS rules change, `vite build` and `oxlint`
  should continue to pass unchanged; no new console errors/warnings are expected because no new JS
  expressions, props, or imports are introduced.
- **Graceful CSS fallback:** If a category class is ever missing or mistyped on a button, that button
  falls back to the existing base `button { ... }` rule (current uniform styling) rather than breaking —
  i.e., category rules are additive on top of, not a replacement for, the base button rule, so a missing
  class degrades to today's look rather than an unstyled/broken button.
- **No functional regression (FR-6, AC-6):** Because no `onClick` handlers, state, or the `calculate`
  function are touched, existing calculator behavior (all arithmetic, clear, decimal entry) is unaffected
  by construction — verification is a manual/visual check plus existing build/lint, not new unit tests. The
  manual check also covers the Accessibility Considerations above: hover, `:focus-visible` (via keyboard
  Tab navigation), and `:active` feedback on every button category.

## Accessibility Considerations

*(Added post-design-review to close a Gate 2 gap — the original draft only name-dropped "hover/focus" once
in the Overview without following through on focus, active, or a concrete contrast target.)*

- **Keyboard focus must remain visible (NFR-1, plus repo-wide UI guardrail):** every button category
  defines an explicit `:focus-visible` rule (e.g., a high-contrast `outline` or `box-shadow`) rather than
  relying on the browser default, since the dark `.calculator`/`.display` background can make default
  browser focus rings hard to see. The `:focus-visible` treatment should be visually related to (but not
  identical to) each category's `:hover` treatment so keyboard users get feedback equivalent to mouse users.
- **`:active` (pressed) state:** each category adds a simple `:active` rule (e.g., a further-darkened
  background or a subtle `transform: scale(0.97)`) so mouse, touch, and keyboard (Enter/Space) activation
  all get visible press feedback, consistent with hover/focus.
- **Contrast target (concrete, not just "best effort"):** the best-effort WCAG AA goal from
  `requirements.md` Open Question 2 is operationalized as a **4.5:1 minimum contrast ratio** between each
  category's text color and its background color (normal-size button text), spot-checked with a browser
  DevTools contrast checker (or equivalent) during Implementation for all four category colors plus their
  hover/focus/active variants. This is a manual check, not an automated gate, per the resolved open question.
- **No ARIA changes needed:** all buttons are native `<button>` elements with visible, human-readable text
  content (digits, operator symbols, `C`, `=`), so no `aria-label`/`role` additions are required by this
  color-coding change.

## Security Considerations

- **No security-relevant surface is touched.** This change does not modify `calculate()`, event handlers,
  or any data parsing/evaluation logic. The known `eval()`-based code-injection risk (CWE-95) in
  `calculate()` is explicitly out of scope for SCRUM-6 (per requirements.md) and is untouched by this
  architecture.
- **No new dependencies** are introduced, so there is no new third-party supply-chain surface to review.
- **No user-controlled input flows into CSS** — category class names are static, developer-authored
  strings in JSX, not derived from any runtime/user data, so there is no CSS/HTML injection concern.
- **No secrets, tokens, or environment values** are involved in a color-coding change.

## Assumptions/Constraints

- The current dark calculator theme (`.calculator` background `#222`, `.display` background `#111`) is the
  single fixed palette's backdrop; the new category colors are chosen to read well against that dark
  background specifically (per resolved Open Question 2 — no light/dark theme toggle, single fixed
  palette).
- Color convention follows standard calculator UX (neutral gray for digits/decimal, amber/orange for
  operators, red for clear, a distinct accent color for equals), per resolved Open Question 1 — exact hex
  values are a design/implementation detail decided in the Implementation stage, not fixed here.
- WCAG AA contrast is a best-effort design goal, not a hard automated gate (per resolved Open Question 2);
  no automated contrast-checking tooling is introduced as part of this change.
- Existing grid layout and structural spans (`.clear` span 2, `.equals` row span 2, `.zero` span 2) are
  preserved exactly; only color/visual styling is added (NFR-3).
- Adding category `className` values to buttons in `src/App.jsx` is the only anticipated source-file touch
  point; all color rules live in `src/App.css`. This document does not itself modify `src/App.jsx` or
  `src/App.css` — those edits belong to the Implementation stage, per this stage's guardrails.
- No new npm dependencies, CSS frameworks, or build configuration changes are assumed or required
  (NFR-2).
