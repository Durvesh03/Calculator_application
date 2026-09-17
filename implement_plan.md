# implement_plan.md (DRAFT)

## Jira
- Ticket: SCRUM-15  
- Link: https://durveshtambe3.atlassian.net/browse/SCRUM-15

## Repo
- https://github.com/Durvesh03/Calculator_application.git

## Enhancement Summary
Apply a consistent button color theme and interaction feedback to the calculator UI:
- Distinguish **numeric**, **operator**, and **action** buttons via color styling.
- Add **pressed/active** feedback and smooth transitions.
- Keep layout and calculator functionality unchanged.

## Scope / Non-Goals
### In scope
- CSS-only styling updates (and minimal HTML class additions if needed) to:
  - Assign theme colors per button type.
  - Add `:active` pressed state feedback.
  - Add transition(s) for hover/active effects.
- Ensure existing grid layout remains identical.

### Out of scope
- Any changes to calculation logic or button labels.
- Layout restructuring (grid rows/columns, spans).
- New features (history, keyboard support, scientific mode).

## Proposed Implementation

### 1) Inspect current structure
- Identify:
  - Where buttons are defined (likely `index.html`).
  - Current button selectors in CSS (likely `style.css` or similar).
  - Existing hover effects (`button:hover` opacity, etc.).
- Confirm how operator/action buttons are currently identified:
  - If there are already classes/IDs (e.g., `.operator`, `.clear`, `.equal`) reuse them.
  - If not, add minimal semantic classes.

### 2) Add semantic classes (if missing)
Add classes in HTML for styling hooks without impacting behavior:
- Numeric: `.btn-number` (0–9, `.`)
- Operator: `.btn-operator` (`+ - * /`)
- Action: `.btn-action` (e.g., `C` / Clear)
- Equals: `.btn-equals`

Notes:
- Keep existing IDs or data attributes used by JS intact.
- Do not change button order or grid placement.

### 3) Define theme tokens in CSS
Add CSS variables at `:root` (or top-level container) to centralize theme colors:
- `--btn-number-bg`, `--btn-number-fg`
- `--btn-operator-bg`, `--btn-operator-fg`
- `--btn-action-bg`, `--btn-action-fg`
- `--btn-equals-bg`, `--btn-equals-fg`
- `--btn-border` (optional)
- `--btn-shadow` (optional subtle shadow)
- `--btn-active-scale` (e.g., `0.98`)
- `--btn-transition` (e.g., `120ms ease`)

Pick a palette that:
- Maintains legible contrast (dark text on light buttons or vice versa).
- Looks consistent with existing background/container.

### 4) Apply base button styling
Ensure a common baseline for all buttons:
- `transition: transform var(--btn-transition), filter var(--btn-transition), background-color var(--btn-transition);`
- Optional: consistent border radius, font weight, shadow.

### 5) Apply per-type styling
Use the classes to set:
- Background color
- Text color
- Optional: border/shadow variations

Example (conceptual):
- `.btn-number { background: var(--btn-number-bg); color: var(--btn-number-fg); }`
- `.btn-operator { background: var(--btn-operator-bg); color: var(--btn-operator-fg); }`
- `.btn-action { background: var(--btn-action-bg); color: var(--btn-action-fg); }`
- `.btn-equals { background: var(--btn-equals-bg); color: var(--btn-equals-fg); }`

### 6) Add interaction feedback (hover + active)
- Keep/replace existing hover behavior with something consistent:
  - `:hover` could slightly brighten/darken via `filter: brightness(1.05);` or similar.
- Add `:active` pressed state:
  - `transform: scale(var(--btn-active-scale));`
  - `filter: brightness(0.95);` (or adjust to fit palette)
  - Optional: reduce shadow to simulate press.

Ensure pressed feedback applies to all button types.

### 7) Validate layout unchanged
- Confirm existing grid-span behavior (e.g., Clear/Zero wider, equals taller) remains untouched.
- Avoid changes to `grid-template-*` or button sizing rules that could cause reflow.

## Files Likely to Change
- `index.html` (only if classes need to be added to buttons)
- `style.css` (or the project’s main stylesheet)

## Test Plan
### Manual UI checks
1. Load app in browser.
2. Verify:
   - Number buttons share the same style.
   - Operator buttons share the same style distinct from numbers.
   - Clear/action button is visually distinct.
   - Equals button is visually distinct and emphasized.
3. Hover over buttons: subtle feedback appears.
4. Press and hold (mouse down) on each button type:
   - Button shows pressed styling (`:active`) and returns on release.
5. Confirm calculator functionality unchanged:
   - Basic operations still compute correctly.
   - Clear still resets.
   - Decimal input still works.
6. Confirm layout unchanged:
   - Same grid arrangement and spans as before.

### Cross-browser sanity
- Quick check in Chrome + Firefox (and optionally Edge).

## Risks / Considerations
- If the current JS depends on button text or DOM structure, adding classes should be safe, but ensure no selector conflicts.
- CSS specificity: avoid overly broad selectors that could override layout rules.
- Contrast/accessibility: choose colors that remain readable.

## Branch Plan (for later)
- Branch name: `feature/SCRUM-15`

## Definition of Done
- Acceptance criteria met for SCRUM-15.
- No functional regressions.
- UI layout unchanged.
- Code committed with clear message(s).
