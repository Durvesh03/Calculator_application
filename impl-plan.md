# Implementation Plan: SCRUM-6 Color-Coded Calculator Controls

## Scope

This plan implements only the approved presentation enhancement in `src/App.jsx` and `src/App.css`. It preserves the existing calculator button order, grid layout, visible labels and symbols, event handlers, calculation behavior, and dependencies.

## Dependency-Ordered Tasks

### T-1: Add additive button category classes

- **File:** `src/App.jsx`
- **Depends on:** None.
- Add the `number` class to buttons `0` through `9` and `.`.
- Add the `operator` class to `÷`, `×`, `−`, and `+`.
- Compose `clear` with the existing `clear` layout class and `equals` with the existing `equals` layout class.
- Compose `number` with the existing `zero` layout class for `0`.
- Preserve every button's order, text/symbol, native `<button>` element, `onClick` handler, and existing layout class.
- **Completion condition:** Every rendered calculator control has exactly one category class, while `clear`, `equals`, and `zero` retain their grid-layout behavior.

### T-2: Implement centralized category tokens and interaction states

- **File:** `src/App.css`
- **Depends on:** T-1, because CSS selectors target the category classes introduced there.
- Define reusable CSS custom properties for the approved palette at shared scope:
  - Number: `--number-default: #E5E7EB`, `--number-hover: #D1D5DB`, `--number-active: #9CA3AF`, foreground `#111827`.
  - Operator: `--operator-default: #0F766E`, `--operator-hover: #115E59`, `--operator-active: #134E4A`, foreground `#FFFFFF`.
  - Clear: `--clear-default: #B91C1C`, `--clear-hover: #991B1B`, `--clear-active: #7F1D1D`, foreground `#FFFFFF`.
  - Equals: `--equals-default: #1D4ED8`, `--equals-hover: #1E40AF`, `--equals-active: #1E3A8A`, foreground `#FFFFFF`.
- Add category selectors for `.number`, `.operator`, `.clear`, and `.equals` that consume the centralized tokens for default background and foreground colors.
- Replace or override the global `button:hover { opacity: 0.8; }` rule with explicit category `:hover` backgrounds so hover states retain their intended contrast.
- Add explicit category `:active` backgrounds. A `transform: translateY(1px)` is permitted only if it does not change the grid tracks, button dimensions, or spans.
- Add a shared `button:focus-visible` rule with `outline: 3px solid #111827` and `outline-offset: 3px`; do not remove native button semantics or visible labels.
- Do not change the current grid, button height, dimensions, font size, border radius, responsive behavior, or layout selectors.
- **Completion condition:** All four categories have distinct token-based default, hover, and active states, plus an independent visible keyboard-focus indicator with readable normal-sized label contrast of at least WCAG 2.1 AA $4.5:1$ in each color state.

### T-3: Validate behavior, keyboard interaction, and responsive presentation

- **Files under validation:** `src/App.jsx`, `src/App.css`
- **Depends on:** T-1 and T-2.
- Run the repository's available static and production checks:
  - `npm run lint`
  - `npm run build`
- Run `npm run dev` for manual browser verification, then stop the local server after verification.
- Manually verify at the default desktop viewport and a narrow viewport:
  - Numeric buttons, including `0` and `.`, share the numeric treatment; arithmetic buttons share the operator treatment; `C` and `=` have their specified separate treatments.
  - Hover and pressed states use the category-specific colors without changing control sizing, grid spans, labels, or symbols.
  - Tab navigation exposes the `3px` dark focus outline and Enter/Space activates the focused button.
  - Pointer and keyboard flows continue to support number entry, decimal entry, arithmetic operations, clear, and equals; confirm one representative calculation such as `7 + 3 = 10` and that `C` resets the display.
  - Labels remain readable and unobscured at both viewport sizes.
- **Completion condition:** Both commands exit successfully and manual checks confirm SCRUM-6 acceptance criteria without a calculator behavior or layout regression.

## Sequencing

Implement T-1 before T-2 because CSS category selectors require stable button class hooks. Complete T-2 before T-3 so validation covers the final classes, palette tokens, interaction states, focus treatment, and preserved behavior as a single integrated slice.

## Suggested Commit Breakdown

1. `feat(calculator): add semantic control category classes`
   - T-1 changes in `src/App.jsx` only.
2. `feat(calculator): color code calculator control states`
   - T-2 changes in `src/App.css`, followed by T-3 lint, build, and manual evidence.

## Verification Approach

| Check | Command / method | Expected evidence |
| --- | --- | --- |
| Static analysis | `npm run lint` | Exits with status 0. |
| Production build | `npm run build` | Vite production build completes successfully. |
| Interactive UI | `npm run dev` | Desktop and narrow viewport checks pass for category colors, hover, active, focus-visible, readable labels, and unchanged grid sizing. |
| Behavior preservation | Pointer and keyboard activation during the running app | Number, decimal, operator, clear, and equals actions work as before; `7 + 3 = 10` and `C` resets the display. |

## Blockers and Assumptions

- No blockers are known. The approved design palette and focus-ring values are implementation inputs.
- The existing Vite development environment is the verification environment because no browser/device matrix is specified.
- `package.json` defines no test script; validation is limited to the exact `lint`, `build`, and manual browser checks above.
- No dependency, calculation logic, component hierarchy, button labels, button order, or grid/layout change is permitted.