# Verification — SCRUM-6: Color-code Calculator Buttons by Category

**Branch:** `ghcp-capstone-security`
**Source docs reviewed:** [requirements.md](requirements.md), [architecture.md](architecture.md), [design-review.md](design-review.md), [impl-plan.md](impl-plan.md), [code-review.md](code-review.md)
**Files under verification:** [src/App.jsx](src/App.jsx), [src/App.css](src/App.css)

## 1. Commands Executed

### 1.1 `npm run lint`

**Command:** `npm run lint` (repo root, branch `ghcp-capstone-security`)
**Exit code:** `0`

```
> calculator@0.0.0 lint
> oxlint

src/App.jsx:42:12: warning eslint(no-eval): eval can be harmful. help: Avoid eval(). For JSON parsing use JSON.parse(); for dynamic property access use bracket notation (obj[key]); for other cases refactor to avoid evaluating strings as code.
```

**Result:** PASS (exit 0). Only one warning is emitted, for the pre-existing `eval()` call in `calculate()` — this is documented as an accepted, out-of-scope risk in [security-remediation.md](security-remediation.md) and [code-review.md](code-review.md), and is unrelated to the color-coding change (no new lint errors/warnings introduced).

### 1.2 `npm run build`

**Command:** `npm run build` (repo root, branch `ghcp-capstone-security`)
**Exit code:** `0`

```
> calculator@0.0.0 build
> vite build

vite v8.2.2 building client environment for production...
✓ 17 modules transformed.
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-vh4FfN62.css    2.84 kB │ gzip:  1.14 kB
dist/assets/index-jK0m84AO.js   194.15 kB │ gzip: 60.70 kB

[EVAL] Use of direct `eval` function is strongly discouraged as it poses security risks and may cause issues with minification.
    ╭─[ src/App.jsx:34:10 ]
    │
 34 │        return eval(`${first}${operator}${second}`);
    │               ──┬─  
    │                 ╰─── Use of direct `eval` here.
    │ 
    │ Help: Consider using indirect eval. For more information, check the documentation: https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval
────╯

✓ built in 130ms
```

**Result:** PASS (exit 0). Production build completes successfully; `dist/index.html`, CSS, and JS bundles are generated. The only diagnostic surfaced is the same pre-existing `eval` warning (build-time equivalent of the lint warning) — no new build errors or warnings.

### 1.3 Test script

No `test` script exists in [package.json](package.json) (`scripts` contains only `dev`, `build`, `lint`, `preview`). Consistent with impl-plan.md's verification approach, which relies on `npm run lint` + `npm run build` + manual/static checklist rather than an automated test suite. **Recorded as a known limitation (see §4), not silently skipped.**

## 2. Manual / Static Verification Checklist (AC-1 → AC-6)

Evidence quoted directly from the final [src/App.jsx](src/App.jsx) and [src/App.css](src/App.css) on branch `ghcp-capstone-security`.

### AC-1: Number buttons (0–9, `.`) appear in a neutral color, distinct from operator/clear/equals

**JSX evidence** — every digit button, the decimal button, and the zero button carry `className="number"` (zero combines with `zero` for layout):
```jsx
<button className="number" onClick={() => inputNumber("7")}>7</button>
<button className="number" onClick={() => inputNumber("8")}>8</button>
<button className="number" onClick={() => inputNumber("9")}>9</button>
...
<button className="number zero" onClick={() => inputNumber("0")}>0</button>
<button className="number" onClick={handleDecimal}>.</button>
```

**CSS evidence:**
```css
.calculator {
  --color-number-bg: #3a3a3c;
  --color-number-text: #f5f5f5;
  ...
}

.number {
  background: var(--color-number-bg);
  color: var(--color-number-text);
}
```
`#3a3a3c` is distinct from `--color-operator-bg: #ff9f0a`, `--color-equals-bg: #0066cc`, and `--color-clear-bg: #d32f2f`.

**Verdict: PASS**

### AC-2: All four operator buttons (÷ × − +) appear in the same single accent color

**JSX evidence:**
```jsx
<button className="operator" onClick={() => inputOperator("/")}>÷</button>
<button className="operator" onClick={() => inputOperator("*")}>×</button>
<button className="operator" onClick={() => inputOperator("-")}>−</button>
<button className="operator" onClick={() => inputOperator("+")}>+</button>
```
All four use the single class `operator` with no per-symbol variation.

**CSS evidence:**
```css
.operator {
  background: var(--color-operator-bg);
  color: var(--color-operator-text);
}
```
Single rule → identical `#ff9f0a` background / `#1a1a1a` text applied uniformly to all four.

**Verdict: PASS**

### AC-3: Equals button (=) appears in an accent color distinct from the operator accent color

**JSX evidence:**
```jsx
<button className="equals" onClick={handleEquals}>
  =
</button>
```

**CSS evidence:**
```css
.equals {
  grid-row: span 2;
  background: var(--color-equals-bg);
  color: var(--color-equals-text);
}
```
with `--color-equals-bg: #0066cc` vs. `--color-operator-bg: #ff9f0a` — clearly distinct hues (blue vs. amber).

**Verdict: PASS**

### AC-4: Clear button (C) appears in red

**JSX evidence:**
```jsx
<button className="clear" onClick={clearCalculator}>
  C
</button>
```

**CSS evidence:**
```css
.clear {
  grid-column: span 2;
  background: var(--color-clear-bg);
  color: var(--color-clear-text);
}
```
with `--color-clear-bg: #d32f2f` — a standard red hex value.

**Verdict: PASS**

### AC-5: Existing hover effect (opacity change) still visibly applies to all buttons

**CSS evidence** — the hover rule is a single, generic selector, unmodified and not overridden per-category:
```css
button:hover {
  opacity: 0.8;
}
```
No category rule (`.number`, `.operator`, `.clear`, `.equals`) declares an `opacity` property, so none of them can override this rule via specificity — all four categories inherit the same `0.8` hover opacity. Confirmed by reading the full [src/App.css](src/App.css): `opacity` appears exactly once in the file, on the generic `button:hover` selector.

**Verdict: PASS**

### AC-6: No functional/behavioral regression (numbers, operators, decimal, clear, equals)

**Evidence** — diffing the JSX against the documented pre-change behavior in architecture.md/impl-plan.md: all state (`display`, `firstNumber`, `operator`, `waitingForSecondNumber`) and handlers (`inputNumber`, `inputOperator`, `calculate`, `handleEquals`, `clearCalculator`, `handleDecimal`) are present and unchanged in logic — only `className` attributes were added/extended. Relevant excerpt:
```jsx
const calculate = (first, second, operator) => {
  // Vulnerable: builds an expression string and evaluates it (CWE-95 code injection).
  return eval(`${first}${operator}${second}`);
};
```
`calculate()` is untouched (matches code-review.md's finding, and confirms the out-of-scope `eval()` vulnerability was neither fixed nor worsened by this story). No `onClick` handler signature or JSX structural change was found while reading the file.

Build success (`npm run build`, §1.2) additionally confirms no JSX syntax errors were introduced that would break rendering.

**Verdict: PASS** (static evidence only — no interactive/browser-driven functional test was executed in this verification pass; see §4 limitations).

## 3. Design-Review Action-Item Checkpoints

From [design-review.md](design-review.md) §5 Action Items:

### Checkpoint A — Zero button dual-class rendering (`className="number zero"`)

**Evidence:**
```jsx
<button className="number zero" onClick={() => inputNumber("0")}>
  0
</button>
```
```css
.number {
  background: var(--color-number-bg);
  color: var(--color-number-text);
}
...
.zero {
  grid-column: span 2;
}
```
`.number` sets only `background`/`color`; `.zero` sets only `grid-column`. No overlapping CSS properties exist between the two classes, so both apply simultaneously without conflict — the zero button gets the neutral number color **and** the 2-column grid span. This matches design-review.md's R4 "Accept as-is" analysis exactly.

**Verdict: PASS (static confirmation)**

### Checkpoint B — Hover opacity working across all colored categories

**Evidence:** As in AC-5 above — a single generic `button:hover { opacity: 0.8; }` rule with no per-category `opacity` override anywhere in [src/App.css](src/App.css) (confirmed by full-file read — `opacity` occurs exactly once). Since specificity/override risk requires a competing `opacity` declaration on `.number`, `.operator`, `.clear`, or `.equals`, and none exists, the hover effect is guaranteed to apply identically across all four colored categories.

**Verdict: PASS (static confirmation)**

> Note: Both checkpoints are confirmed via static code reading (CSS cascade/specificity analysis), not via a live browser hover/render check. This is documented as a limitation in §4.

## 4. Remaining Limitations

1. **No automated test suite exists** in this repository ([package.json](package.json) has no `test` script) — AC-6 and the two design-review checkpoints are verified via static code reading only, not via an automated or interactive browser-driven check (no `npm run dev` session, click-through, or screenshot capture was performed in this verification pass).
2. **No formal WCAG contrast measurement tool was run** — the ~5:1–10:1 contrast estimates cited in architecture.md/design-review.md were not independently re-verified with a contrast-checking tool in this stage; per requirements.md, formal contrast/accessibility verification is explicitly out of scope for this story.
3. **Pre-existing `eval()` usage in `calculate()`** (CWE-95) remains unresolved — explicitly out of scope for SCRUM-6 per requirements.md and already tracked in [security-remediation.md](security-remediation.md); it is the sole source of both the lint warning and the build warning above, and is unaffected by this verification pass.

## 5. Summary

| Check | Result |
|---|---|
| `npm run lint` | PASS (exit 0, 1 pre-existing unrelated warning) |
| `npm run build` | PASS (exit 0, 1 pre-existing unrelated warning) |
| AC-1 (number neutral color) | PASS |
| AC-2 (operators shared accent) | PASS |
| AC-3 (equals distinct accent) | PASS |
| AC-4 (clear red) | PASS |
| AC-5 (hover opacity preserved) | PASS |
| AC-6 (no functional regression) | PASS (static evidence) |
| Design-review Checkpoint A (zero dual class) | PASS (static confirmation) |
| Design-review Checkpoint B (hover across categories) | PASS (static confirmation) |

**Overall verification outcome: PASS**, with limitations noted in §4 (no automated test script; no live browser interaction check; contrast not independently re-measured).
