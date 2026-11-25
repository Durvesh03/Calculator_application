# Implementation Plan - SCRUM-20: Add visible focus and active styles to calculator buttons

## 1. Overview
- **Jira:** SCRUM-20  
  https://durveshtambe3.atlassian.net/browse/SCRUM-20
- **Goal:** Add clear, accessible visual states for calculator buttons:
  - Visible keyboard focus indicator (`:focus-visible`)
  - Pressed/active feedback (`:active`)
  - Smooth transitions, while keeping hover behavior
- **Business / UX value:** Improves keyboard accessibility and usability (users can see where focus is and when a button is being pressed), aligning with WCAG visible focus expectations.
- **Estimated effort:** Small (≈ 0.5–1.0 hr). CSS-only change.

## 2. Current State Analysis
- **Tech stack detected:** React (Vite) app.
  - UI in `src/App.jsx`
  - Styling in plain CSS (`src/App.css`)
- **Files inspected:**
  - `src/App.jsx`
  - `src/App.css`
- **How styling is applied today:**
  - Global element selectors in `App.css` (e.g., `button { ... }`, `button:hover { ... }`)
  - Specific layout classes: `.calculator`, `.display`, `.buttons`, plus `.clear`, `.equals`, `.zero`
- **Current visual behavior (buttons):**
  - Buttons have base style:
    - `height: 60px; border: none; border-radius: 8px; font-size: 22px; cursor: pointer;`
  - Hover style:
    - `button:hover { opacity: 0.8; }`
  - **No explicit focus styles** (browser default may be suppressed visually due to lack of outline handling / contrast).
  - **No active/pressed style**.

## 3. Detailed Changes (one sub-section PER FILE)

### 3.1 `src/App.css`  -  Change type: Modify
- **Purpose of change:**
  - Introduce accessible focus ring for keyboard navigation using `button:focus-visible`.
  - Add pressed-state feedback using `button:active`.
  - Refine hover from opacity-only to a more informative style while keeping existing behavior intent.
  - Add transitions for smoother state changes.
- **Exact elements/selectors/components affected:**
  - `button` (base styles)
  - `button:hover` (refine)
  - `button:focus-visible` (add)
  - `button:active` (add)
  - `button:focus` (add reset to avoid focus ring on mouse click while still supporting `:focus-visible`)
- **Exact property changes (summary):**
  - Add to `button`:
    - `background: #e6e6e6;` (explicit default so hover/active adjustments are predictable)
    - `color: #111;`
    - `transition: transform 150ms ease, background-color 150ms ease, box-shadow 150ms ease, opacity 150ms ease;`
    - `outline: none;` (paired with `:focus-visible` to keep keyboard focus visible without showing on mouse focus)
  - Change `button:hover`:
    - from `opacity: 0.8;`
    - to `background: #dcdcdc; opacity: 1;` (keep hover effect but make it clearer than dimming)
  - Add `button:focus-visible`:
    - `outline: 3px solid #22c55e; outline-offset: 3px;`
    - `box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.35);`
  - Add `button:active`:
    - `transform: translateY(1px);`
    - `background: #cfcfcf;`
- **Before** (real code):
```css
button {
  height: 60px;
  border: none;
  border-radius: 8px;
  font-size: 22px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}
```

- **After** (complete proposed code block):
```css
button {
  height: 60px;
  border: none;
  border-radius: 8px;
  font-size: 22px;
  cursor: pointer;

  /* Explicit defaults so state styling is consistent across browsers */
  background: #e6e6e6;
  color: #111;

  /* Use focus-visible for keyboard users; avoid default outline flicker */
  outline: none;

  /* Smooth state transitions */
  transition:
    transform 150ms ease,
    background-color 150ms ease,
    box-shadow 150ms ease,
    opacity 150ms ease;
}

button:hover {
  /* More informative than dimming; keep hover intent without reducing legibility */
  background: #dcdcdc;
  opacity: 1;
}

button:focus {
  /* Ensure only :focus-visible shows a ring (mouse clicks won't show focus ring) */
  outline: none;
}

button:focus-visible {
  /* High-contrast ring against dark calculator background (#222 / #111) */
  outline: 3px solid #22c55e;
  outline-offset: 3px;

  /* Extra halo helps visibility on lighter button backgrounds */
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.35);
}

button:active {
  /* Pressed feedback */
  transform: translateY(1px);
  background: #cfcfcf;
}
```

- **Notes (side-effects, inheritance, specificity):**
  - Adding `background` + `color` to `button` changes the default look slightly (previously relied on browser default button styles). This is intentional to make hover/active deterministic.
  - `outline: none` is safe here because `:focus-visible` adds a clear indicator for keyboard users. (If a browser doesn’t support `:focus-visible`, focus ring may not appear; see “Risks & Mitigations”.)
  - Selectors remain low-specificity element selectors, consistent with current CSS style.

### 3.2 `src/App.jsx`  -  Change type: Modify (No code change planned)
- **Purpose of change:** None required. Buttons are native `<button>` elements, so they already receive focus in tab order and support `:focus-visible` and `:active`.
- **Elements affected:** None.
- **Before** (real code snippet, showing buttons are plain `<button>`):
```jsx
<div className="buttons">
  <button className="clear" onClick={clearCalculator}>
    C
  </button>

  <button onClick={() => inputOperator("/")}>÷</button>
  <button onClick={() => inputOperator("*")}>×</button>
  ...
</div>
```
- **After:** No change.
- **Notes:** If later design requires different styles for operators vs numbers, we may add classes in JSX. That is **out of scope** for SCRUM-20.

## 4. Design Tokens / Visual Specification

| Token | Value | Used in | Notes |
|------|-------|---------|------|
| `--calc-bg` | `#222` | `.calculator` | Existing container background |
| `--calc-display-bg` | `#111` | `.display` | Existing display background |
| `--btn-bg` | `#e6e6e6` | `button` | New explicit default button background |
| `--btn-text` | `#111` | `button` | New explicit default text color |
| `--btn-hover-bg` | `#dcdcdc` | `button:hover` | Replaces opacity-only hover |
| `--btn-active-bg` | `#cfcfcf` | `button:active` | Pressed background |
| `--focus-ring` | `#22c55e` | `button:focus-visible` | High-contrast green ring |
| `--focus-halo` | `rgba(34, 197, 94, 0.35)` | `button:focus-visible` | Halo improves visibility |
| `--radius-md` | `8px` | `button`, `.display` | Existing rounded corners |
| `--transition-fast` | `150ms ease` | `button` | Smooth hover/focus/active |

## 5. Step-by-Step Implementation Tasks
- [ ] Update `src/App.css` `button` rule to include explicit `background`, `color`, `outline: none`, and transition properties.
- [ ] Replace `button:hover` opacity-only style with `background` change (keep `opacity: 1`).
- [ ] Add `button:focus-visible` styles (outline + offset + box-shadow halo).
- [ ] Add `button:active` pressed styles (transform + background).
- [ ] Run the app and manually verify keyboard tab focus and click/tap press feedback on all buttons.

## 6. Acceptance Criteria Traceability

| AC # | Acceptance Criterion | Implemented by (file/section) | How to verify |
|------|----------------------|-------------------------------|--------------|
| AC1 | Tab to any button shows clearly visible focus indicator distinct from default | `src/App.css` §3.1 `button:focus-visible` | Use keyboard Tab/Shift+Tab; confirm ring appears on focused button |
| AC2 | Click/tap and hold shows pressed/active state while pressed | `src/App.css` §3.1 `button:active` | Click and hold any button; confirm translateY + darker bg applies |
| AC3 | Keyboard-only navigation always shows which button has focus | `src/App.css` §3.1 `button:focus-visible` | Tab through all buttons; focus ring is always visible |
| AC4 | Focus indicator clearly perceivable against calculator background | `src/App.css` §3.1 focus ring tokens | Visual check: green ring stands out against `#222` and `#111` |
| AC5 | Calculator behavior/result unchanged | No JS changes | Perform `1 + 2 =` and other ops; results should match current behavior |

## 7. Testing Plan
- **Manual test cases**
  1. **Keyboard focus visibility**
     - Steps: Load app → press `Tab` repeatedly through all buttons.
     - Expected: Each focused button shows a visible green outline/halo.
  2. **Pressed state**
     - Steps: Click and hold any number button (e.g., `7`).
     - Expected: Button appears pressed (moves down slightly + darker background) while mouse is down.
  3. **Hover behavior**
     - Steps: Hover over buttons with mouse.
     - Expected: Background changes subtly; no opacity dimming that reduces legibility.
  4. **Regression: calculation still works**
     - Steps: `1`, `+`, `2`, `=`
     - Expected: Display shows `3`. Other operations (÷, ×, −, decimals, clear) behave as before.

- **Cross-browser:** Chrome, Firefox, Edge, Safari (latest)
  - Verify `:focus-visible` behavior and appearance in each.
- **Responsive checks:** 360px, 768px, 1280px+
  - Ensure ring/outline isn’t clipped; outline-offset should remain visible inside calculator container.
- **Accessibility**
  - Ensure visible focus indicator is present and prominent.
  - Ensure buttons remain keyboard reachable and operable.
  - Ensure focus indicator isn’t color-only meaning for state changes (shape/outline + halo helps; pressed uses movement + background).
  - Contrast: focus ring color `#22c55e` against dark container `#222` should be clearly visible; also visible against light button surface due to halo + outline.
- **Automated tests**
  - **ASSUMPTION:** No test framework present in repo (none observed in tree). No test updates required.

## 8. Risks & Mitigations
- **Risk:** Some older browsers may not support `:focus-visible`, causing missing focus ring due to `outline: none`.
  - **Mitigation:** If this becomes a requirement, add a fallback:
    - `button:focus { outline: 3px solid #22c55e; outline-offset: 3px; }`
    - and optionally gate with `@supports selector(:focus-visible)` pattern. (Not included unless requested.)
- **Risk:** Changing default button background may slightly alter existing look.
  - **Mitigation:** Use neutral light gray close to typical default; easy to tweak if design prefers different tone.

## 9. Rollback Plan
- Revert the CSS changes in `src/App.css` for `button` state selectors to restore previous hover-only behavior (`opacity: 0.8`).

## 10. Out of Scope
- Changing calculator logic (operators, eval/calculate behavior).
- Adding new buttons or changing layout/labels.
- Styling differentiation for operator vs number buttons (would require JSX classes or more CSS).

## 11. Definition of Done
- All acceptance criteria pass via manual verification.
- Focus ring is visible and consistent across supported browsers.
- No calculator functional regression.
- Code is formatted and consistent with existing CSS style.

## 12. Delivery Details
- **Branch:** feature/SCRUM-20
- **Base branch:** main
- **Commit message:** `SCRUM-20: add focus-visible and active button styles`
- **PR title:** `SCRUM-20: Visible focus + pressed styles for calculator buttons`
- **PR description outline:**
  - What: Added `:focus-visible` ring + `:active` pressed feedback and refined hover styling for calculator buttons.
  - Why: Improve keyboard accessibility and interaction clarity.
  - How tested: Tab navigation through buttons; click-and-hold pressed state; verified calculations unchanged.
