# implement_plan.md — SCRUM-18 Button press + focus feedback (CSS-only)

## Jira
- **Ticket:** SCRUM-18
- **Link:** https://durveshtambe3.atlassian.net/browse/SCRUM-18
- **Branch (later):** `feature/SCRUM-18`

## Goal / Summary
Improve calculator UI responsiveness and accessibility by adding:
- **Pressed state** styling for mouse/touch (`:active`)
- **Keyboard focus** styling (`:focus-visible`)
- Apply consistently across all calculator buttons, with **no changes to calculator logic**.

## Non-Goals
- No changes to calculation logic or button wiring.
- No layout redesign, new components, or new dependencies.
- No color/theme overhaul beyond what’s  needed for visible interaction feedback.

## Repo
- https://github.com/Durvesh03/Calculator_application.git

## Assumptions / Notes
- Buttons are standard HTML `<button>` elements rendered in React (typical for a calculator UI).
- Primary styling is likely in `src/App.css` (or similar). We will keep changes CSS-only.
- Ensure focus styles do not appear on mouse click by using `:focus-visible` (with a fallback if needed).


## Implementation Steps

### 1) Locate button styling and structure
- Inspect `src/App.js` (or components) to confirm button elements and any class names used.
- Identify CSS file(s) controlling button appearance:
  - Likely `src/App.css` and/or `src/index.css`.

### 2) Add consistent base button interaction styling
In the primary CSS file (expected `src/App.css`), update the button selector(s) used for calculator keys.

Add/adjust:
- `transition` for smooth feedback
- `transform` and `box-shadow` changes for pressed state
- `outline` / `box-shadow` ring for focus-visible state

Example plan (exact selector will match existing code, e.g. `.button` or `.keypad button`):

`css
/* Base */
button {
  transition: transform 80ms ease, box-shadow 120ms ease, filter 120ms ease;
}

/* Pressed state */
button:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.25);
}

/* Keyboard focus only */
button:focus-visible {
  outline: 3px solid rgba(0, 150, 255, 0.85);
  outline-offset: 2px;
}

/* Optional: avoid double focus styling if any existing outline/shadow exists */
button:focus {
  outline: none; /* only if current design already handles focus; otherwise omit */
}
```

### 3) Ensure consistency across all button types
- If the app uses different classes for operators/equals/clear, ensure the new states apply to all:
  - If there’s a shared base class, apply to that.
  - If different selectors exist, apply `:active` and `:focus-visible` to each group.

### 4) Avoid regressions in hover styling
- Keep existing hover opacity behavior if present.
- Ensure the new pressed/focus states don’t conflict:
  - `:active` should override hover when pressed.
  - `:focus-visible` should remain visible even if hover is active.

### 5) Accessibility check
- Confirm focus ring is clearly visible against button background colors.
- Confirm that focus ring appears when using keyboard (Tab) and not on mouse click (modern browsers with `:focus-visible`).

### 6) Lightweight manual testing
Run the app locally and verify:

**Mouse/touch**
- Click and hold on any button → visible pressed state.
- Release → returns to normal.

**Keyboard**
- Tab through buttons → visible focus ring moves.
- Press Enter/Space on a focused button —> pressed state appears during activation.

**Scope**
- Numbers, operators, clear, equals, and zero all behave consistently.

## Files Expected to Change
- `src/App.css` (primary)
- Possibly `src/index.css` (if button styles are defined there instead)
- No JS changes expected.

## Acceptance Criteria Mapping
1. **Pressed state on click/tap** → `button:active` styling.
2. **Keyboard focus indicator** —> `button:focus-visible` styling.
3. **Consistent across all buttons** → apply to shared selector or all relevant button classes.
4. **No functional changes** → CSS-only changes.

## Risks & Mitigations
- **Risk:** Existing CSS may already set `outline: none` globally, hiding focus.
  - **Mitigation:** Add explicit `:focus-visible` outline and avoid removing it.

## Definition of Done
- CSS updated with `:active` and `:focus-visible` styles.
- Manual verification for mouse/touch and keyboard navigation.
- No changes to calculation behavior.
- Code committed on the branch `feature/SCRUM-18`.
