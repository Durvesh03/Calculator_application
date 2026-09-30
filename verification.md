# Verification — SCRUM-6: Calculator Button Color Coding + `eval()` Security Fix

**Branch:** `ghcp-capstone-with-security-fixes` (confirmed active; no branch switch or commit performed during this stage)
**Scope verified against:** [requirements.md](requirements.md) (FR-1–FR-6, NFR-1–NFR-5, AC-1–AC-6), [impl-plan.md](impl-plan.md) Verification Approach, [design-review.md](design-review.md) (contrast ratios), [security-remediation.md](security-remediation.md) (eval() fix)

## 1. Commands Executed

### 1.1 `git branch --show-current`

```text
ghcp-capstone-with-security-fixes
```

**Result:** PASS — correct feature branch is checked out; no work was done on `main`.

### 1.2 `npm run lint`

Note: direct `npm run lint` via PowerShell failed with `npm.ps1 cannot be loaded because running scripts is disabled on this system` (PowerShell execution-policy restriction on this machine, not a project issue). Re-ran via `cmd /c "npm run lint"` to bypass the PowerShell script-execution restriction.

```text
> calculator@0.0.0 lint
> oxlint
```

Exit code: `0`

**Result:** PASS — no lint errors or warnings reported by `oxlint`.

### 1.3 `npm run build`

Re-ran via `cmd /c "npm run build"` for the same reason as above.

```text
> calculator@0.0.0 build
> vite build

vite v8.2.2 building client environment for production...
✓ 17 modules transformed.
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-B2wC7BZF.css    2.99 kB │ gzip:  1.18 kB
dist/assets/index-Cf-8UEf_.js   192.11 kB │ gzip: 60.39 kB

✓ built in 130ms
```

Exit code: `0`

**Result:** PASS — production build completes cleanly, no build errors.

### 1.4 Test script

`package.json` scripts: `dev`, `build`, `lint`, `preview` — **no `test` script is defined** and no test runner (e.g., Jest/Vitest) is present in `devDependencies`. No automated test suite exists in this repo.

**Result:** N/A — not skipped silently; recorded under Remaining Limitations below.

## 2. Manual / Functional Checklist

### 2.1 Arithmetic behavior unchanged — trace `7 → + → 3 → =` (AC-6)

Traced through [src/App.jsx](src/App.jsx) state machine:

| Step | Action | State before | State after |
|---|---|---|---|
| 1 | Click `7` | `display="0"`, `firstNumber=null`, `operator=null`, `waitingForSecondNumber=false` | `inputNumber("7")`: `display==="0"` → `display="7"` |
| 2 | Click `+` | `display="7"` | `inputOperator("+")`: `inputValue=7`; `operator` is `null` so the early-return branch is skipped; `firstNumber===null` → `setFirstNumber(7)`; then `setWaitingForSecondNumber(true)`, `setOperator("+")` |
| 3 | Click `3` | `waitingForSecondNumber=true` | `inputNumber("3")`: branch taken → `setDisplay("3")`, `setWaitingForSecondNumber(false)` |
| 4 | Click `=` | `operator="+"`, `firstNumber=7`, `display="3"` | `handleEquals()`: `secondNumber=3`; `calculate(7, 3, "+")` → `switch` case `"+"` → `7 + 3 = 10`; `setDisplay("10")`, `setFirstNumber(null)`, `setOperator(null)`, `setWaitingForSecondNumber(true)` |

**Display shows `10`.** Matches pre-change expected behavior (AC-6).

### 2.2 `C` resets state

`clearCalculator()` sets `display="0"`, `firstNumber=null`, `operator=null`, `waitingForSecondNumber=false` — full reset to initial state, unconditionally, regardless of prior state. Confirmed by direct read of [src/App.jsx](src/App.jsx#L69-L74).

**Result:** PASS.

### 2.3 `eval()` security fix does not alter arithmetic semantics

`calculate()` ([src/App.jsx](src/App.jsx#L38-L52)) now uses an explicit `switch` (`+`, `-`, `*`, `/`, `default: return second`) instead of `eval()`. Traced call sites (`inputOperator`, `handleEquals`) confirm `calculate()` is only ever invoked with numeric `first`/`second` and one of the four operator strings set by the four operator buttons — the `switch` covers every call path, so behavior (including `/` by zero returning `Infinity`, per [security-remediation.md](security-remediation.md)) is unchanged.

**Result:** PASS — matches [security-remediation.md](security-remediation.md) verification notes.

### 2.4 Button categories map to distinct CSS colors (AC-1–AC-4)

Cross-checked [src/App.jsx](src/App.jsx) `className` attributes against [src/App.css](src/App.css) rules:

| Category | JSX hook | CSS rule | Color variables |
|---|---|---|---|
| Digits (`0`–`9`, `.`) | none (default `button`) / `.zero` (layout span only, no color override) | `button { background: var(--color-digit-bg); color: var(--color-digit-text); }` | `--color-digit-bg: #4a4a4a`, `--color-digit-text: #ffffff` |
| Operators (`÷ × − +`) | `className="operator"` (all 4 present) | `.operator { background: var(--color-operator-bg); color: var(--color-operator-text); }` | `--color-operator-bg: #ff9500`, `--color-operator-text: #1a1a1a` |
| Clear (`C`) | `className="clear"` | `.clear { ...; background: var(--color-clear-bg); color: var(--color-clear-text); }` | `--color-clear-bg: #d32f2f`, `--color-clear-text: #ffffff` |
| Equals (`=`) | `className="equals"` | `.equals { ...; background: var(--color-equals-bg); color: var(--color-equals-text); }` | `--color-equals-bg: #1565c0`, `--color-equals-text: #ffffff` |

All four categories resolve to distinct, non-overlapping colors. `.zero` retains only its `grid-column: span 2` layout rule (no color override), so `0` correctly inherits the digit color — matching design-review.md decision #5.

**Result:** PASS (AC-1, AC-2, AC-3, AC-4).

### 2.5 Contrast ratios ≥ 4.5:1 (NFR-1)

Per computed ratios recorded in [design-review.md](design-review.md) and [impl-plan.md](impl-plan.md) (not re-computed here; no contrast-checking tool is available in this repo/session, consistent with impl-plan.md's noted assumption that contrast verification is manual):

| Category | Background | Text | Computed ratio | ≥4.5:1? |
|---|---|---|---|---|
| Digit | `#4a4a4a` | `#ffffff` | ≈8.87:1 | PASS |
| Operator | `#ff9500` | `#1a1a1a` | ≈7.91:1 | PASS |
| Clear | `#d32f2f` | `#ffffff` | ≈4.98:1 | PASS (narrow margin — flagged in design-review.md as regression-sensitive if hex changes) |
| Equals | `#1565c0` | `#ffffff` | ≈5.75:1 | PASS (corrected during design review from a failing `#2979ff`/≈3.99:1 pairing) |

Confirmed the implemented hex values in [src/App.css](src/App.css) (`#4a4a4a`, `#ff9500`/`#1a1a1a`, `#d32f2f`, `#1565c0`) match exactly the values design-review.md verified — no last-minute palette drift.

**Result:** PASS (NFR-1), based on design-review.md's documented computed ratios; no independent re-measurement tool was run in this session.

### 2.6 Hover / focus states exist (AC-5)

Confirmed in [src/App.css](src/App.css#L61-L76):

```css
button:hover { opacity: 0.8; }

button:focus {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
}

button:focus:not(:focus-visible) { outline: none; }

button:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
}
```

Hover dims via `opacity: 0.8` (applies on top of any category background). Focus outline is mandatory (not `:focus-visible`-only), with mouse-click suppression via `:focus:not(:focus-visible)`, matching design-review.md decision #4. No live browser/Tab-through session was performed in this stage (static CSS review only, since browser automation was not required); this is recorded as a limitation below.

**Result:** PASS (static review); manual/browser Tab-through not executed in this session.

### 2.7 Layout regression check (NFR-4)

`grid-template-columns: repeat(4, 1fr)`, `.clear { grid-column: span 2; }`, `.equals { grid-row: span 2; }`, `.zero { grid-column: span 2; }`, and the `.calculator` card (`width: 320px`, padding, border-radius) are all present and unchanged in [src/App.css](src/App.css), alongside the new color rules — no layout properties were altered.

**Result:** PASS.

## 3. Document Quality Checks

| Document | Present | Required sections present |
|---|---|---|
| [requirements.md](requirements.md) | Yes | Scope, FR-1–FR-6, NFR-1–NFR-5, AC-1–AC-6, Open Questions |
| [architecture.md](architecture.md) | Yes | (referenced by design-review.md and impl-plan.md as updated in place) |
| [design-review.md](design-review.md) | Yes | Risks/Gaps table, Decisions, computed contrast ratios |
| [impl-plan.md](impl-plan.md) | Yes | Dependency-ordered tasks (T-1–T-5), Verification Approach, Blockers/Assumptions |
| [security-remediation.md](security-remediation.md) | Yes | Vulnerability found (`eval()` CWE-95), fix applied, verification, other checks (XSS, secrets, `npm audit`) |
| [code-review.md](code-review.md) | Yes (present in repo root; not re-reviewed in this stage) | — |

All upstream stage documents required by the pipeline are present and internally consistent (palette hex values match across design-review.md, impl-plan.md, and the actual [src/App.css](src/App.css) implementation).

## 4. Remaining Limitations

1. **No automated test suite exists** — `package.json` defines no `test` script and no test runner is installed. This is a pre-existing repo characteristic, not a regression introduced by SCRUM-6; recorded here rather than silently skipped.
2. **Contrast ratios were not independently re-measured with a live tool** in this session (no contrast-checking utility available); PASS status above relies on the computed values already verified and documented in [design-review.md](design-review.md)/[impl-plan.md](impl-plan.md), cross-checked against the actual implemented hex values in [src/App.css](src/App.css).
3. **No live browser/keyboard Tab-through was performed** for the hover/focus-visible check (AC-5) — verification is based on static CSS review confirming the mandatory `:focus`/`:focus-visible`/`:hover` rules exist and target all button categories, per design-review.md decision #4. Browser automation was not exercised in this session.
4. **PowerShell execution policy on this machine blocks `npm.ps1` directly** — commands were successfully re-run via `cmd /c "npm run <script>"` to obtain real output; this is a local environment constraint, not a project defect.

## Overall Verify Gate Status

**PASS** — `npm run lint` and `npm run build` both succeed with no errors (exit code 0 each); manual functional trace confirms arithmetic behavior and `C` reset are unchanged; the `eval()` → `switch` security fix preserves behavior; button categories map to four distinct CSS-variable-driven colors meeting the ≥4.5:1 contrast ratios documented in design-review.md; hover/focus/focus-visible CSS rules are present and correctly scoped; layout is unchanged. Limitations (no test suite, no live browser contrast/focus re-measurement) are documented above and do not block the gate given the CSS-only, logic-preserving nature of this change and the corroborating static evidence.
