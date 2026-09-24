# Code Review — SCRUM-6 (Color-Coding) + eval() Security Fix

**Branch:** `ghcp-capstone-with-security-fixes`
**Reviewed changes:**
1. Uncommitted working-tree diff: [src/App.jsx](src/App.jsx) (+8/-4) and [src/App.css](src/App.css) (+37) — color-coding of calculator buttons (SCRUM-6).
2. Prior commit `6650933` "security: replace eval() with safe arithmetic in calculate() (CWE-95)" — reviewed for correctness/regressions since it's referenced as context.

**References used:** [requirements.md](requirements.md), [architecture.md](architecture.md), [design-review.md](design-review.md), [impl-plan.md](impl-plan.md), [security-remediation.md](security-remediation.md).

## Checklist Results

| # | Review Area | Result | Notes |
|---|---|---|---|
| 1 | **Correctness** — matches FR-1..FR-6 / AC-1..AC-6 | **PASS** | `git diff` shows exactly the planned changes (T-1..T-4 in [impl-plan.md](impl-plan.md)): `--color-*` custom properties added to `.calculator`; `className="operator"` added to the 4 operator buttons only (`/`, `*`, `-`, `+`); digit/default `button` rule, `.operator`, `.clear`, `.equals` each get a background/text color pair; mandatory `:focus` + `:focus-visible` rules added. Digits 0–9, `.`, and `0` (`.zero`) all fall through to the default `button` rule (FR-1). No changes to `inputNumber`, `inputOperator`, `calculate`, `handleEquals`, `handleDecimal`, `clearCalculator`, state, or `onClick` handlers (FR-5, AC-6). |
| 2 | **Security** — eval() fix correct, no new vulnerabilities | **PASS** | Commit `6650933` replaced `eval(\`${first}${operator}${second}\`)` with an explicit `switch` over `"+" \| "-" \| "*" \| "/"` performing plain numeric arithmetic; `default` returns `second` (matches prior fallthrough behavior, e.g. unknown operator no-op). Division by zero still returns `Infinity` (unchanged behavior, not a regression). Repo-wide search confirms no other `eval(`, `new Function(`, `dangerouslySetInnerHTML`, `innerHTML`, or `document.write` usages — the only remaining string `eval()` is inside a code comment. The SCRUM-6 color-coding diff itself touches only static `className` values and CSS — no new user input handling, no new dynamic code execution, no new dependencies. |
| 3 | **Accessibility** — contrast, focus-visible, no regressions | **PASS** | Recomputed WCAG 2.1 contrast ratios for all four category pairs against `#ffffff`/`#1a1a1a` text: digit `#4a4a4a` ≈ 8.86:1, operator `#ff9500`/`#1a1a1a` ≈ 7.91:1, clear `#d32f2f` ≈ 4.98:1 (passes AA 4.5:1, narrow margin as flagged in design-review.md), equals `#1565c0` ≈ 5.73:1 — all pass AA for normal text (NFR-1). `button:focus` + `button:focus:not(:focus-visible){outline:none}` + `button:focus-visible` implemented exactly as the mandatory fallback decided in design-review.md (AC-5, works across browsers without native `:focus-visible` support). Existing `button:hover{opacity:.8}` untouched. Button labels (digits, `÷ × − +`, `C`, `=`) still convey meaning independent of color (WCAG SC 1.4.1). |
| 4 | **Code quality/consistency** — CSS variables, no dead code, minimal diff | **PASS** | Palette defined once as CSS custom properties on `.calculator` and reused via `var(...)` in `button`, `.operator`, `.clear`, `.equals` (NFR-5, DRY). No duplicated color literals outside the variable block. `.clear`/`.equals` layout rules (`grid-column: span 2`, `grid-row: span 2`) were extended in place rather than duplicated, per design-review.md's readability recommendation. Diff is minimal and additive — matches the diff shape predicted in impl-plan.md's verification step (JSX: 4 `className` additions only; CSS: additive color/focus rules). `npm run lint` (oxlint) passes with no errors/warnings. |
| 5 | **No regressions to layout or calculator logic** | **PASS** | 4-column grid (`grid-template-columns: repeat(4, 1fr)`), `.clear{grid-column:span 2}`, `.equals{grid-row:span 2}`, `.zero{grid-column:span 2}`, and the 320px `.calculator` card (width/padding/border-radius) are all unchanged in the diff — only color properties were added alongside existing layout declarations. Manually traced all event handlers (`inputNumber`, `inputOperator`, `calculate`, `handleEquals`, `clearCalculator`, `handleDecimal`) — no changes; `calculate()`'s post-fix `switch` covers all four operators used by `inputOperator`/`handleEquals`, matching prior `eval` behavior for every real call path. |

## Additional Notes (non-blocking, informational)

- **Test coverage:** The repo has no automated test setup (`package.json` scripts: `dev`, `build`, `lint`, `preview` only — no `test` script or test files). This is a pre-existing condition, not introduced or worsened by either reviewed change, so it is not scored as a failure here, but is worth flagging for a future story.
- **Dependency safety:** Per [security-remediation.md](security-remediation.md), `npm audit` reports 0 vulnerabilities (React 19.2.8, Vite 8.2.2, oxlint 1.79.0). No dependency changes were introduced by the SCRUM-6 diff.

## Issues Found

None. No defects, security gaps, accessibility regressions, or logic regressions were identified in the reviewed diff.

## Fixes Applied

None required. Per this review mode's guardrails, findings are recorded here rather than applied directly to code; since no issues were found, no code changes were made during this review.

## Overall Verdict

**APPROVED.** All checklist items PASS. No unresolved security concerns remain — the `eval()` code-injection vulnerability (CWE-95) has been correctly remediated, and the SCRUM-6 color-coding changes introduce no new risk. Safe to proceed to the Verify stage.
