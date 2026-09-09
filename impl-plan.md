# Implementation Plan — SCRUM-6: Color-code Calculator Buttons by Category

**Source:** [requirements.md](requirements.md), [architecture.md](architecture.md), [design-review.md](design-review.md)

## Files to Change

- [src/App.jsx](src/App.jsx) — add `number` / `operator` category class names to button JSX.
- [src/App.css](src/App.css) — add color tokens and category color rules.

No other files are modified (no changes to [src/main.jsx](src/main.jsx), [src/index.css](src/index.css), [package.json](package.json), or build config), per architecture.md and NFR-3.

## Assumptions / Blockers

- Assumes current [src/App.jsx](src/App.jsx) / [src/App.css](src/App.css) contents match those reviewed in architecture.md/design-review.md (verified — no drift found).
- No blockers identified; scope is styling-only and self-contained.
- Final token values (post design-review) must be used, not the original architecture proposal:
  - `--color-number-bg: #3a3a3c` / `--color-number-text: #f5f5f5`
  - `--color-operator-bg: #ff9f0a` / `--color-operator-text: #1a1a1a`
  - `--color-equals-bg: #0066cc` / `--color-equals-text: #ffffff`
  - `--color-clear-bg: #d32f2f` / `--color-clear-text: #ffffff`

## Dependency-Ordered Tasks

### T-1: Add CSS color tokens to `.calculator` scope
**File:** [src/App.css](src/App.css)
Add four custom-property pairs inside the existing `.calculator { ... }` rule (not `:root`, per design-review R6 decision):
```css
.calculator {
  /* existing properties unchanged */
  --color-number-bg: #3a3a3c;
  --color-number-text: #f5f5f5;
  --color-operator-bg: #ff9f0a;
  --color-operator-text: #1a1a1a;
  --color-equals-bg: #0066cc;
  --color-equals-text: #ffffff;
  --color-clear-bg: #d32f2f;
  --color-clear-text: #ffffff;
}
```
No dependencies — this is the foundation all subsequent category rules reference.

### T-2: Add `.number` and `.operator` category CSS rules
**File:** [src/App.css](src/App.css)
Add new selectors (near the existing `.clear` / `.equals` / `.zero` rules at the bottom of the file):
```css
.number {
  background: var(--color-number-bg);
  color: var(--color-number-text);
}

.operator {
  background: var(--color-operator-bg);
  color: var(--color-operator-text);
}
```
Depends on T-1 (tokens must exist before being referenced).

### T-3: Extend existing `.clear` and `.equals` rules with color
**File:** [src/App.css](src/App.css)
Add `background`/`color` declarations to the existing rules without altering their current layout declarations:
```css
.clear {
  grid-column: span 2;
  background: var(--color-clear-bg);
  color: var(--color-clear-text);
}

.equals {
  grid-row: span 2;
  background: var(--color-equals-bg);
  color: var(--color-equals-text);
}
```
Depends on T-1. Independent of T-2 (can be done in the same commit/pass).

### T-4: Add `className="number"` to digit and decimal buttons in JSX
**File:** [src/App.jsx](src/App.jsx)
Update each digit button (`1`–`9`, excluding `0`) and the decimal button (`.`) to include `className="number"`:
- `7`, `8`, `9`, `4`, `5`, `6`, `1`, `2`, `3`, and the decimal (`.`) button.
Example:
```jsx
<button className="number" onClick={() => inputNumber("7")}>7</button>
...
<button className="number" onClick={handleDecimal}>.</button>
```
Depends on T-2 (the `.number` CSS rule must exist for the class to have visual effect, though JSX/CSS ordering is not build-blocking — sequencing here is for correctness/testability).

### T-5: Combine `.number` with the existing `.zero` class
**File:** [src/App.jsx](src/App.jsx)
Update the `0` button from `className="zero"` to `className="number zero"` (per design-review R4 — verified no conflicting CSS properties between `.number` and `.zero`, safe to combine; class order irrelevant).
```jsx
<button className="number zero" onClick={() => inputNumber("0")}>0</button>
```
Depends on T-2 and T-4 (same category-class change, kept as a distinct step because it also preserves the existing layout class).

### T-6: Add `className="operator"` to the four operator buttons
**File:** [src/App.jsx](src/App.jsx)
Update the ÷, ×, −, + buttons:
```jsx
<button className="operator" onClick={() => inputOperator("/")}>÷</button>
<button className="operator" onClick={() => inputOperator("*")}>×</button>
<button className="operator" onClick={() => inputOperator("-")}>−</button>
<button className="operator" onClick={() => inputOperator("+")}>+</button>
```
Depends on T-3 (`.operator` rule existing — note: `.operator` rule itself was added in T-2; `.operator` CSS depends only on T-1/T-2, this JSX step just needs T-2 completed).

### T-7: Verify `.clear` and `.equals` JSX class names are unchanged
**File:** [src/App.jsx](src/App.jsx)
No JSX edit needed — confirm `className="clear"` (C button) and `className="equals"` (= button) are left exactly as-is; their new colors come entirely from the T-3 CSS extension. This is a verification-only checkpoint, not a code change.
Depends on T-3.

## Suggested Commit Breakdown

1. **Commit 1 — CSS tokens + category rules** (T-1, T-2, T-3): all changes confined to [src/App.css](src/App.css). Self-contained; app still renders identically until JSX classes are added (no visual effect yet since no elements reference `.number`/`.operator`, and `.clear`/`.equals` picking up new colors is expected/desired even standalone).
2. **Commit 2 — JSX category class names** (T-4, T-5, T-6, T-7): all changes confined to [src/App.jsx](src/App.jsx). Applies the new classes so colors from Commit 1 become visible; no logic/handler changes.

(Two commits is the minimum sensible split matching the two files in scope; combining into one commit is also acceptable if preferred.)

## Verification Approach

### Automated checks (run from repo root)
1. `npm run lint` — oxlint static check; must pass with no new errors introduced by the class-name/CSS changes.
2. `npm run build` — Vite production build; must complete successfully, confirming no JSX/syntax errors.
3. No test script exists in [package.json](package.json); no automated unit/UI tests are run for this change (styling-only, out of scope to add new tests).

### Manual visual verification (map to AC-1–AC-6)
Run `npm run dev`, open the app in a browser, and visually confirm:

- **AC-1 (number buttons neutral color):** digits `0`–`9` and `.` render with `#3a3a3c` background / `#f5f5f5` text, visually distinct from operator/clear/equals buttons.
- **AC-2 (operator buttons shared accent):** ÷, ×, −, + all render identically with `#ff9f0a` background / `#1a1a1a` text.
- **AC-3 (equals distinct accent):** `=` renders with `#0066cc` background / `#ffffff` text, visually distinct from the operator accent (`#ff9f0a`).
- **AC-4 (clear button red):** `C` renders with `#d32f2f` background / `#ffffff` text.
- **AC-5 (hover preserved):** hover over one button from each category (number, operator, equals, clear) and confirm the opacity visibly reduces (0.8) for all four, with no per-category override breaking it.
- **AC-6 (no functional regression):** perform a full calculation sequence — e.g., `7` → `+` → `3` → `=` shows `10`; press `C` and confirm display resets to `0`; type `5` → `.` → `2` → `+` → `1` → `=` shows `6.2` — confirming number entry, operator selection, decimal handling, clear, and equals all behave exactly as before.

### Additional design-review checkpoints (from Action Items)
- Visually confirm the `0` button renders **both** the 2-column grid span (layout) **and** the neutral number color (T-5).
- Confirm no `:root`-scoped tokens were introduced (token block must live inside `.calculator`, per R6).
