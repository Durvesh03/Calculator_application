# Code Review — SCRUM-6: Color-code Calculator Buttons by Category

**Reviewed files:** [src/App.jsx](src/App.jsx), [src/App.css](src/App.css)
**Reviewed against:** [requirements.md](requirements.md), [architecture.md](architecture.md), [design-review.md](design-review.md), [impl-plan.md](impl-plan.md), [security-remediation.md](security-remediation.md)
**Branch:** `ghcp-capstone-security`
**Reviewer role:** Peer code reviewer (review stage gate)

## 1. Summary

The implementation matches the plan exactly: four CSS custom-property tokens added inside `.calculator` (not `:root`), `.number`/`.operator` category rules added, `.clear`/`.equals` extended with color while their existing grid-span layout rules are untouched, and static `className` values (`number`, `operator`, `number zero`) applied to the corresponding buttons in JSX. No component state, handlers, `calculate()`/`eval()` logic, or grid structure were changed. **No issues found; no fixes required.**

## 2. Checklist

### AC / Functional Correctness (requirements.md)

| Item | Result | Notes |
|---|---|---|
| AC-1: Number buttons (0–9, `.`) neutral color, distinct from other categories | PASS | All digit buttons + `.` + zero button carry `className="number"` → `#3a3a3c` bg / `#f5f5f5` text; distinct from `#ff9f0a`, `#0066cc`, `#d32f2f`. |
| AC-2: All four operator buttons (÷ × − +) same single accent color | PASS | All four use `className="operator"` only → identical `#ff9f0a` bg / `#1a1a1a` text. |
| AC-3: Equals button distinct accent from operator accent | PASS | `.equals` → `#0066cc`, clearly distinct from `#ff9f0a`. |
| AC-4: Clear button red | PASS | `.clear` → `#d32f2f` (red). |
| AC-5: Hover opacity effect still applies to all buttons | PASS | Generic `button:hover { opacity: 0.8; }` rule unchanged, class-agnostic; confirmed no per-category override introduced. |
| AC-6: No functional/behavioral regression | PASS | `App.jsx` handlers (`inputNumber`, `inputOperator`, `calculate`, `handleEquals`, `clearCalculator`, `handleDecimal`) and state (`display`, `firstNumber`, `operator`, `waitingForSecondNumber`) are byte-for-byte unchanged; only `className` attributes were added. |

### Consistency with architecture.md / design-review.md

| Item | Result | Notes |
|---|---|---|
| Tokens scoped to `.calculator`, not `:root` | PASS | Confirmed in [src/App.css](src/App.css) — all 8 `--color-*` custom properties are declared inside the `.calculator { ... }` block; no `:root` block was introduced (per design-review R6 decision). |
| Token values match final (post-design-review) table | PASS | `--color-number-bg:#3a3a3c`, `--color-number-text:#f5f5f5`, `--color-operator-bg:#ff9f0a`, `--color-operator-text:#1a1a1a`, `--color-equals-bg:#0066cc`, `--color-equals-text:#ffffff`, `--color-clear-bg:#d32f2f`, `--color-clear-text:#ffffff` — all match impl-plan.md's T-1 exactly (darkened equals/clear values used, not the original `#0a84ff`/`#ff3b30` proposals). |
| Correct class names applied (`number`, `operator`, reuse of `clear`/`equals`/`zero`) | PASS | Matches impl-plan.md T-4–T-6 exactly; zero button is `className="number zero"` per T-5, decimal button uses `className="number"`. |
| `.clear` / `.equals` layout rules (`grid-column: span 2` / `grid-row: span 2`) preserved | PASS | Both rules retain their original layout declaration alongside the new `background`/`color` declarations, per T-3. |
| `.zero` class unchanged, layout-only | PASS | `.zero { grid-column: span 2; }` — no color properties added here (color comes from the combined `.number` class), consistent with design-review R4 (no property overlap). |

### Code Quality / Conventions

| Item | Result | Notes |
|---|---|---|
| Matches existing repo style (plain CSS, static class literals, JSX formatting) | PASS | No CSS-in-JS, no inline styles, no `data-*` attributes introduced; consistent with pre-existing `.clear`/`.equals`/`.zero` pattern. Quote style (double quotes) and indentation consistent with rest of file. |
| No duplicated/scattered hex literals (NFR-1) | PASS | All four colors defined once as custom properties and referenced via `var(...)`; no hardcoded hex values in the new `.number`/`.operator`/`.clear`/`.equals` rules. |
| No dead code / unused classes introduced | PASS | Every new class (`number`, `operator`) is referenced by at least one element; no orphaned selectors. |

### Regression Checks

| Item | Result | Notes |
|---|---|---|
| Hover behavior (opacity) | PASS | `button:hover { opacity: 0.8; }` rule is unmodified and remains generic across all categories. |
| Grid layout (zero span, clear span, equals span) | PASS | `.zero` (`grid-column: span 2`), `.clear` (`grid-column: span 2`), `.equals` (`grid-row: span 2`) all unchanged; `.buttons` grid definition (`grid-template-columns: repeat(4, 1fr)`) untouched. |
| No logic/handler changes | PASS | Diff confined to `className` additions in JSX; no changes to function bodies, state, or JSX structure/order. |
| `eval()` in `calculate()` untouched | PASS | `calculate()` still uses `eval(`${first}${operator}${second}`)`, with its existing "Vulnerable" comment intact — matches security-remediation.md's explicit out-of-scope decision. |

### Security

| Item | Result | Notes |
|---|---|---|
| No new attack surface introduced | PASS | All new `className` values (`"number"`, `"operator"`, `"number zero"`) are static string literals in JSX, never derived from props/state/user input — no dynamic class construction. |
| No new injection vectors in CSS | PASS | New CSS is limited to custom-property declarations and static hex values; no `url()`, `expression()`, `@import`, or attribute-based CSS injection introduced. |
| No unresolved security concerns in scope | PASS | The only known vulnerability (`eval()`, CWE-95) is pre-existing, explicitly out of scope per requirements.md, and already documented/accepted in security-remediation.md — not introduced or worsened by this change. |

### Additional (SKILL.md review areas)

| Item | Result | Notes |
|---|---|---|
| Error Handling | N/A | Purely presentational change; no new logic, async behavior, or inputs requiring error handling. |
| Test Coverage | N/A | No test suite exists in this repo ([package.json](package.json) has no test script); consistent with impl-plan.md's verification approach (manual visual + lint/build only). |
| DRY Principle | PASS | Colors centralized in custom properties; no duplicated hex values across selectors. |
| Dependency Safety | PASS | No new dependencies added; `npm audit --omit=dev` previously reported 0 vulnerabilities (security-remediation.md), unaffected by this change. |

## 3. Issues Found

None. The implementation is a faithful, minimal, in-scope realization of impl-plan.md with no deviations from architecture.md/design-review.md and no regressions detected.

## 4. Fixes Applied

None required.

## 5. Verification Evidence

- `npm run lint` (oxlint) → exit code 0. One pre-existing warning: `src/App.jsx:42` — `eval` can be harmful (`no-eval`), unrelated to this change and already tracked as an accepted, out-of-scope risk in security-remediation.md.
- `npm run build` (Vite) → exit code 0, build succeeded (`dist/index.html` + CSS/JS assets generated). Same pre-existing `eval` warning surfaced during build; no new errors or warnings introduced.

## 6. Outcome

**Review PASSED.** No unresolved security concerns remain in scope. No fixes were necessary. Ready to proceed to the Verify stage.
