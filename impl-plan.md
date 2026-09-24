# Implementation Plan — SCRUM-6: Color-Code Calculator Buttons

**Source:** [requirements.md](requirements.md), [architecture.md](architecture.md), [design-review.md](design-review.md)
**Scope:** CSS-only color coding of calculator buttons (digit/default, operator, clear, equals) plus one `className="operator"` JSX hook. No calculator logic changes. No new dependencies.

## Dependency-Ordered Tasks

### T-1: Add CSS custom properties (color palette) to `.calculator` in `src/App.css`
- **Depends on:** none (foundation for all subsequent CSS rules).
- **Details:** Add a block of CSS custom properties inside the existing `.calculator` rule, defining background/text color pairs for the four categories, using the corrected, contrast-verified values from [design-review.md](design-review.md)/[architecture.md](architecture.md):
  - `--color-digit-bg: #4a4a4a` / `--color-digit-text: #ffffff` (≈8.87:1)
  - `--color-operator-bg: #ff9500` / `--color-operator-text: #1a1a1a` (≈7.91:1 — dark text required, white would fail AA)
  - `--color-clear-bg: #d32f2f` / `--color-clear-text: #ffffff` (≈4.98:1 — narrow margin, do not change hex without re-checking contrast)
  - `--color-equals-bg: #1565c0` / `--color-equals-text: #ffffff` (≈5.75:1 — corrected from the original `#2979ff`, which failed AA at ≈3.99:1)
- **No JSX or logic changes.**

### T-2: Add `className="operator"` to the four operator buttons in `src/App.jsx`
- **Depends on:** T-1 (variables must exist before the `.operator` rule is meaningful, though the class hook itself is independent; sequencing here keeps CSS foundation first).
- **Details:** Add `className="operator"` to the ÷, ×, −, + buttons only (the four `inputOperator(...)` calls: `/`, `*`, `-`, `+`). Do not touch `onClick` handlers, other classNames (`clear`, `equals`, `zero`), JSX structure, or any state/handler code.
- **Verification:** Diff should show only 4 attribute additions in `src/App.jsx`; no other lines changed.

### T-3: Add/extend category CSS rules in `src/App.css` (digit/default, `.operator`, `.clear`, `.equals`)
- **Depends on:** T-1 (variables), T-2 (`.operator` class must exist in JSX for the rule to apply).
- **Details:**
  - Update the existing `button { ... }` rule to add `background: var(--color-digit-bg); color: var(--color-digit-text);` (serves as the digit/default style — the decimal `.` button intentionally falls through to this rule, per design-review.md decision #5).
  - Add a new `.operator { background: var(--color-operator-bg); color: var(--color-operator-text); }` rule.
  - Extend the existing `.clear { grid-column: span 2; }` rule to also include `background: var(--color-clear-bg); color: var(--color-clear-text);` (consolidate into one block per design-review.md gap #5 recommendation, rather than adding a duplicate `.clear` block).
  - Extend the existing `.equals { grid-row: span 2; }` rule the same way with `--color-equals-bg`/`--color-equals-text`.
  - Do not modify `.zero` (layout-only; zero is a digit and already inherits the default `button` color rule).

### T-4: Add mandatory `:focus` and `:focus-visible` states in `src/App.css`
- **Depends on:** T-3 (focus outline should visually work against all finalized category background colors).
- **Details:** Add, near the existing `button:hover { opacity: 0.8; }` rule:
  ```css
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
  This is a mandatory (not optional) fallback per design-review.md decision #4, ensuring AC-5 is met even in browsers without `:focus-visible` support, while suppressing the ring for mouse clicks via `:focus:not(:focus-visible)`.

### T-5: Verify no layout/grid regressions
- **Depends on:** T-1 through T-4 (all styling changes applied).
- **Details:** Confirm the 4-column grid (`grid-template-columns: repeat(4, 1fr)`), `.clear { grid-column: span 2; }`, `.equals { grid-row: span 2; }`, and `.zero { grid-column: span 2; }` layout declarations are unchanged/still present (only color properties were added alongside them), and the 320px `.calculator` card width/padding/border-radius are untouched.

## Suggested Commit Breakdown

1. `feat(css): add color palette custom properties for button categories` — T-1
2. `feat(ui): add operator className hook to operator buttons` — T-2
3. `feat(css): apply category color rules to digit, operator, clear, equals buttons` — T-3
4. `feat(a11y): add mandatory focus and focus-visible states to buttons` — T-4
5. (No separate commit for T-5 — it is a verification step, not a code change; fold its confirmation into the PR description/evidence.)

## Verification Approach

1. **Dev server manual visual check:** Run `npm run dev`, open the app in a browser, and visually confirm:
   - Digits (0–9, `.`) render in the digit color (gray bg, white text).
   - Operators (÷ × − +) render in the operator color (amber bg, dark text).
   - Clear (C) renders red; Equals (=) renders blue — each distinct from the other three categories (AC-1–AC-4).
2. **Contrast ratio check:** Use a contrast-ratio tool (e.g., browser devtools accessibility contrast checker or an online WCAG contrast calculator) to re-verify the four final background/text pairs meet ≥4.5:1 (NFR-1), paying special attention to the clear (`#ffffff`/`#d32f2f` ≈4.98:1, narrow margin) and equals (`#ffffff`/`#1565c0` ≈5.75:1) pairs if any hex value is adjusted from the plan.
3. **Keyboard focus check:** Tab through all buttons and confirm a visible focus outline appears on each (AC-5), and confirm mouse clicks do not show a persistent outline (`:focus:not(:focus-visible)` suppression working as intended).
4. **Hover check:** Hover each button category and confirm the existing `opacity: 0.8` dimming still applies on top of the new background colors.
5. **Functional smoke test (no logic regression, AC-6):** Perform a full calculation sequence (e.g., `7 → + → 3 → =` should show `10`; then `C` should reset to `0`) and confirm behavior is identical to pre-change behavior.
6. **Layout regression check:** Confirm the 4-column grid, clear/equals/zero spans, and 320px card layout are visually unchanged from before the styling change (NFR-4).
7. **Lint:** Run `npm run lint` (oxlint) to confirm no new lint errors from the `App.jsx` className addition.
8. **Diff review:** Confirm `src/App.jsx` diff contains only the four `className="operator"` additions, and `src/App.css` diff contains only additive color/focus rules — no changes to event handlers, state, or existing grid-layout declarations.

## Blockers/Assumptions

- Assumes the illustrative palette finalized in architecture.md/design-review.md (digit `#4a4a4a`/`#ffffff`, operator `#ff9500`/`#1a1a1a`, clear `#d32f2f`/`#ffffff`, equals `#1565c0`/`#ffffff`) is acceptable as the final palette, since no brand-specific palette was provided in the Jira story (requirements.md Open Question 1).
- No automated contrast-ratio or visual-regression tooling exists in this repo (`package.json` only has `oxlint` for lint); contrast and visual checks above are manual per the Verify stage.
- The pre-existing `eval()` usage in `calculate()` (`src/App.jsx`) is explicitly out of scope for this plan and is not touched by any task above.
- No new npm packages are required or introduced by this plan (NFR-3).
