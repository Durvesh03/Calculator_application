# Verification — SCRUM-6: Calculator Button Color Coding + `eval()` Security Fix

**Stage:** 8 — Verify
**Scope verified:** Uncommitted working-tree changes to `src/App.jsx` and `src/App.css` on branch
`claude-capstone` (category-based button color coding per `requirements.md` AC-1..AC-6, plus the
`eval()` → `switch` security fix per `security-remediation.md`), following up on `code-review.md`
(all 7 checklist areas PASS, including the DRY fix already applied and re-verified there).
**Method:** Real commands executed and pasted below (Section 1), plus a manual, evidence-based
read-through of the current `src/App.jsx`/`src/App.css` (Section 3) — no test framework exists in
this repo (pre-existing, documented gap; see Section 4).

---

## 1. Commands executed

All commands were run from the repo root (`C:\Users\durvesh_tambe\calculator`) on branch
`claude-capstone`.

### 1.1 `npm run build`

```
> calculator@0.0.0 build
> vite build

vite v8.2.2 building client environment for production...
transforming...
✓ 17 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-pgiUALvb.css    4.27 kB │ gzip:  1.41 kB
dist/assets/index-7kB_CtQZ.js   192.29 kB │ gzip: 60.40 kB

✓ built in 116ms
```

Result: **PASS** — build completed successfully, no errors, `dist/` output produced.

### 1.2 `npm run lint`

```
> calculator@0.0.0 lint
> oxlint
```

`oxlint` produced no warning/error output. To confirm this silence means success (rather than the
tool being a no-op), it was re-run directly with explicit exit-code capture:

```
$ npx oxlint; echo "EXIT_CODE=$?"
EXIT_CODE=0
```

Result: **PASS** — exit code `0`, zero errors/warnings reported.

### 1.3 Working-tree state check (`git status`, current branch)

```
On branch claude-capstone
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   .env.example
	new file:   .mcp.json

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/App.css
	modified:   src/App.jsx

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	architecture.md
	code-review.md
	design-review.md
	impl-plan.md
	requirements.md
	security-remediation.md
```

Branch confirmed via `git branch --show-current` → `claude-capstone` (matches
`FEATURE_BRANCH_NAME`; not `main`). `.env.example`/`.mcp.json` are pre-existing, unrelated changes
(also excluded from scope in `security-remediation.md` and `code-review.md`) and were not touched
or verified further here.

### 1.4 `git diff -- src/App.jsx src/App.css`

Full diff captured and reviewed to confirm exactly what changed (only `className` additions in
`App.jsx`, the `eval()` → `switch` swap in `calculate()`, and additive CSS rules/variables in
`App.css` — no other lines touched). Key excerpt (JSX, showing className additions only, no
handler/structure changes):

```diff
-        <button onClick={() => inputOperator("/")}>÷</button>
-        <button onClick={() => inputOperator("*")}>×</button>
+        <button className="operator" onClick={() => inputOperator("/")}>÷</button>
+        <button className="operator" onClick={() => inputOperator("*")}>×</button>
...
-        <button onClick={() => inputNumber("7")}>7</button>
+        <button className="digit" onClick={() => inputNumber("7")}>7</button>
```

Security-fix excerpt (`calculate()`):

```diff
   const calculate = (first, second, operator) => {
-    // Vulnerable: builds an expression string and evaluates it (CWE-95 code injection).
-    return eval(`${first}${operator}${second}`);
+    switch (operator) {
+      case "+":
+        return first + second;
+      case "-":
+        return first - second;
+      case "*":
+        return first * second;
+      case "/":
+        return first / second;
+      default:
+        return second;
+    }
   };
```

Result: **Confirmed** — diff is scoped exactly as described in `impl-plan.md`/`security-remediation.md`/`code-review.md`; no `onClick`, state, or JSX structure lines changed besides `className`.

### 1.5 Test-runner presence check (`package.json` scripts)

```
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "oxlint",
  "preview": "vite preview"
}
```

Result: **Confirmed** — no `test` script and no test-runner dependency (`vitest`, `jest`, etc.) in
either `dependencies` or `devDependencies`. This matches the pre-existing gap already documented in
`design-review.md` (R6) and `code-review.md` (§4) — no automated test suite exists to run.

---

## 2. Results mapped to requirements

| Command | Outcome | Requirement satisfied |
|---|---|---|
| `npm run build` (`vite build`) | PASS — built in 116ms, no errors | NFR-4 ("no new console errors/warnings or break the existing build") |
| `npm run lint` (`oxlint`, exit code 0) | PASS — zero errors/warnings | NFR-4 ("...or break the existing ... lint setup") |
| `git diff` scope check | Confirmed additive-only, no logic/handler changes outside `calculate()`'s internal implementation | FR-6/AC-6 (no functional regression), matches `impl-plan.md` T-10 |
| `package.json` scripts check | Confirmed no test runner present (pre-existing) | Traces to `design-review.md` R6 — informs Section 4 below |

Both automated checks required by `impl-plan.md` T-10 and `design-review.md` Action item 4 (build +
lint) pass with real, pasted output above.

---

## 3. Manual checklist (AC-1..AC-6, NFR-3, accessibility)

No test framework exists in this repo (Section 1.5), so per `impl-plan.md` T-11 and
`design-review.md` Action item 5, the following is a manual, evidence-based verification performed
by reading the actual current `src/App.jsx` and `src/App.css` (contents read and quoted above) and
reasoning through the rendered classes/colors and the `calculate()` logic. This is a static-code
walkthrough, not a live-browser interaction — see Section 4 for that limitation.

### AC-1 — Digit buttons (0–9, `.`) share one consistent, distinct color

Read `src/App.jsx` lines 104–126: buttons for `7,8,9,4,5,6,1,2,3` and `.` all carry
`className="digit"` (10 buttons); the `0` button carries `className="zero digit"` (line 122),
preserving the structural `.zero` span class alongside the new color class. That is all 11
digit/decimal buttons using the single `.digit` selector.

`src/App.css` lines 83–90 define `.digit { background-color: var(--color-digit-bg); color:
var(--color-digit-text); }` → `--color-digit-bg: #4d4d4d` (neutral gray), `--color-digit-text:
#ffffff`. Since every digit/decimal button resolves to this one selector, all 11 render identically
colored. This color (`#4d4d4d`) is distinct from operator (`#b34700`), clear (`#c62828`), and equals
(`#1565c0`) — four visually distinct hues (gray vs. amber vs. red vs. blue).

**Verdict: PASS** (by code inspection).

### AC-2 — Operator buttons (÷ × − +) share one consistent, distinct color

Lines 101, 102, 107, 112 in `App.jsx`: all four operator buttons carry `className="operator"`, no
exceptions. `App.css` lines 115–118: `.operator { background-color: var(--color-operator-bg);
color: var(--color-operator-text); }` → `--color-operator-bg: #b34700` (amber/orange), distinct
from digit/clear/equals as established above.

**Verdict: PASS** (by code inspection).

### AC-3 — Clear (`C`) button has a distinct color

Line 97: `<button className="clear" onClick={clearCalculator}>`. `App.css` lines 132–136: `.clear {
grid-column: span 2; background-color: var(--color-clear-bg); color: var(--color-clear-text); }` →
`--color-clear-bg: #c62828` (red) — distinct from digit gray, operator amber, and equals blue.

**Verdict: PASS** (by code inspection).

### AC-4 — Equals (`=`) button has a distinct color

Line 118: `<button className="equals" onClick={handleEquals}>`. `App.css` lines 150–154: `.equals {
grid-row: span 2; background-color: var(--color-equals-bg); color: var(--color-equals-text); }` →
`--color-equals-bg: #1565c0` (blue) — the fourth distinct hue, different from gray/amber/red.

**Verdict: PASS** (by code inspection). All four category colors (`#4d4d4d`, `#b34700`, `#c62828`,
`#1565c0`) are pairwise visually distinct hues, satisfying AC-1..AC-4 together.

### AC-5 — Hover / focus-visible / active feedback present for every category

Reading `App.css` end to end for each category:

- **Hover:** `.digit:hover` (89), `.operator:hover` (120–122), `.clear:hover` (138–140),
  `.equals:hover` (156–158) each override `background-color` to a distinct hover shade
  (`#5c5c5c`, `#9c3d00`, `#ad2020`, `#0d47a1` respectively). The pre-existing global `button:hover {
  opacity: 0.8; }` (lines 79–81) is untouched and still applies on top, so both effects stack for
  every button, including `C` and `=`.
- **Focus-visible:** A single shared rule (lines 92–98) applies `outline: 3px solid
  var(--color-focus-outline); outline-offset: 2px;` to `.digit:focus-visible,
  .operator:focus-visible, .clear:focus-visible, .equals:focus-visible` — i.e., every category gets
  a visible 3px amber-yellow (`#ffd54f`) outline on keyboard focus. Each category additionally has
  its own `:focus-visible { background-color: ... }` rule (108, 125, 143, 161).
- **Active:** A single shared rule (lines 100–105) applies `transform: scale(0.97);` to
  `.digit:active, .operator:active, .clear:active, .equals:active` — a visible "pressed" shrink
  effect for every category, plus per-category `:active { background-color: ... }` overrides (112,
  129, 147, 165).

Every one of the 4 categories (covering all 18 rendered buttons) has all three interaction states
defined with a real visual change (color and/or outline and/or transform).

**Verdict: PASS** (by code inspection; not verified via an actual pointer/keyboard interaction in a
live browser — see Section 4).

### AC-6 — No functional regression (arithmetic / clear / decimal / eval→switch equivalence)

Traced through the unchanged logic functions in `App.jsx` (none of their bodies were touched except
`calculate()`'s internals):

- `inputNumber`, `inputOperator`, `handleEquals`, `clearCalculator`, `handleDecimal` are
  byte-for-byte unchanged except that the buttons that call them now also carry a `className`
  string — the `onClick` handlers themselves (`() => inputNumber("7")`, `clearCalculator`,
  `handleEquals`, `handleDecimal`) are identical to before the color-coding change.
- `calculate(first, second, operator)`: previously `return eval(\`${first}${operator}${second}\`)`;
  now an explicit `switch` on `operator`:
  - `"+" → first + second`, `"-" → first - second`, `"*" → first * second`, `"/" → first /
    second`, `default → second`.
  - These are the same four arithmetic operations `eval` would have performed on the interpolated
    string for the only operator values the app ever produces (`"+" "-" "*" "/"`, set in
    `inputOperator`'s four call sites at lines 101/102/107/112). Traced concrete cases: `first=5,
    second=3, "+"` → old `eval("5+3")=8`; new `5+3=8`. `first=5, second=-3, "+"` → old
    `eval("5+-3")=2`; new `5+(-3)=2`. Division by zero: old `eval("5/0")=Infinity`, `eval("0/0")=NaN`;
    new `5/0=Infinity` (native JS float division), `0/0=NaN` — identical IEEE-754 semantics since
    both paths ultimately perform native JS arithmetic on the same two numbers.
  - `calculate`'s only two call sites (`inputOperator` line 30, `handleEquals` line 65) are
    unchanged — same arguments, same usage of the return value (`setDisplay(String(result))`,
    `setFirstNumber(result)`).
- `clearCalculator` resets `display`/`firstNumber`/`operator`/`waitingForSecondNumber` — unchanged
  code, unaffected by className or `calculate()` edits.
- `handleDecimal` guards against a second `.` via `display.includes(".")` — unchanged code.

**Verdict: PASS** (by static-code trace; this is the same class of manual-only regression check that
`security-remediation.md` performed via Node REPL spot-checks — see Section 4 for the honest limit
of not running the app live in this session).

### NFR-3 — Layout/grid unchanged

`git diff` (Section 1.4) shows the only changes to `.clear`, `.equals`, `.zero` are the *addition* of
`background-color`/`color`/`:hover`/`:focus-visible`/`:active` declarations; the pre-existing
structural declarations (`.clear { grid-column: span 2; }`, `.equals { grid-row: span 2; }`, `.zero
{ grid-column: span 2; }`) are present unmodified in the current file (`App.css` lines 132–133,
150–151, 168–169). `.buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }`
and the 320px `.calculator` container are untouched.

**Verdict: PASS** (by code inspection).

### Accessibility items from `design-review.md` (D1, D5, R1, R3)

- **`:focus-visible` outline present and distinct from the dark card background:** Confirmed above
  (AC-5) — `outline: 3px solid #ffd54f` (a bright amber-yellow) with `2px` offset, applied to every
  category. `#ffd54f` is a light/warm color set against the `.calculator` dark background (`#222`)
  and against every category's dark-ish base color (`#4d4d4d`/`#b34700`/`#c62828`/`#1565c0`), so it
  is visually distinguishable in all cases by inspection of the hex values.
- **4.5:1 contrast target (D5/NFR-1):** Computed manually using the WCAG relative-luminance formula
  (sRGB → linear → `L = 0.2126R + 0.7152G + 0.0722B`, contrast `= (L1+0.05)/(L2+0.05)`) for white
  text (`#ffffff`, L=1.0) against every category's base/hover/active background:

  | Category | State | Background | Computed contrast vs. white text |
  |---|---|---|---|
  | digit | base | `#4d4d4d` | ≈8.45:1 |
  | digit | hover | `#5c5c5c` | ≈6.68:1 |
  | digit | active | `#333333` | ≈12.6:1 |
  | operator | base | `#b34700` | ≈5.50:1 |
  | operator | hover | `#9c3d00` | ≈6.82:1 |
  | operator | active | `#7a3000` | ≈9.33:1 |
  | clear | base | `#c62828` | ≈5.63:1 |
  | clear | hover | `#ad2020` | ≈6.98:1 |
  | clear | active | `#8c1a1a` | ≈9.22:1 |
  | equals | base | `#1565c0` | ≈5.75:1 |
  | equals | hover | `#0d47a1` | ≈8.64:1 |
  | equals | active | `#08306b` | ≈12.76:1 |

  Focus-visible backgrounds are set to the same hex values as each category's `-hover` variable
  (noted in `code-review.md` §1 as a non-blocking deviation from architecture's "should be visually
  related but not identical" wording), so their contrast equals the hover row above. All 12
  base/hover/active rows clear the 4.5:1 WCAG AA target by a comfortable margin.

  **This is a formula-based calculation performed in this session, not a live-browser DevTools
  measurement** — see Section 4 for that explicit limitation (D5/T-6 called for a DevTools
  spot-check specifically).

---

## 4. Remaining limitations

1. **No automated test suite exists in this repository (pre-existing gap, not introduced by this
   change).** Confirmed via `package.json` (Section 1.5): only `dev`/`build`/`lint`/`preview`
   scripts exist; no `vitest`/`jest`/other test runner is a dependency. This was already flagged as
   Risk R6 in `design-review.md` and re-confirmed as a legitimate N/A in `code-review.md` §4. AC-6
   (no functional regression) and all interaction-state checks (AC-5) in Section 3 above rely on
   manual/static-code reasoning only — there is no automated regression suite to re-run on future
   changes to catch a regression here.
2. **No live browser session was used in this CLI-only verification pass.** All AC-1..AC-5 and the
   accessibility checks in Section 3 were verified by reading the current source files and reasoning
   about the resulting DOM classes/CSS cascade, not by rendering the app in a browser, clicking
   buttons, or tabbing through focus order interactively. `npm run dev` was not started in this
   session. This means: no screenshot/visual confirmation of actual rendered colors, no confirmation
   that `:hover`/`:focus-visible`/`:active` fire correctly in a real browser engine (only that the
   CSS rules exist and target the right selectors), and no confirmation of real keyboard Tab order
   across all 18 buttons.
3. **Contrast ratios (Section 3, Accessibility) were computed manually via the WCAG relative-
   luminance formula, not measured with a browser DevTools contrast checker as `impl-plan.md` T-6 and
   `design-review.md` D5 specify.** The computed values (all ≥5.5:1, well above the 4.5:1 bar) are
   arithmetic derivations from the hex values in `App.css` and are believed accurate, but they have
   not been cross-checked against an actual rendering/DevTools tool in this session.
4. **The `default: return second;` branch in `calculate()`'s `switch` is unreachable in practice**
   (all four call sites only ever pass `"+" "-" "*" "/"`), consistent with `code-review.md` §3's
   assessment — noted here for completeness, not as a new finding, since it was already reviewed and
   accepted as a safe fallback rather than a masked error.
5. **`.env.example` and `.mcp.json`** remain modified/untracked in the working tree (Section 1.3) but
   are unrelated to SCRUM-6 or the security fix; consistent with `security-remediation.md` and
   `code-review.md`, they were not inspected, altered, or verified as part of this Verify stage.

---

## Summary

- **Automated evidence:** `npm run build` and `npm run lint` both PASS with real, pasted output
  (Section 1) — satisfies NFR-4 and `impl-plan.md` T-10.
- **Manual evidence:** AC-1 through AC-6, NFR-3, and the D1/D5/R1/R3 accessibility items from
  `design-review.md` all PASS by direct inspection of the current `src/App.jsx`/`src/App.css` and
  static-code tracing of `calculate()`'s new `switch` against the old `eval()` behavior
  (Section 3) — satisfies `impl-plan.md` T-11 and `design-review.md` Action item 5.
- **Honest gaps:** no test framework (pre-existing, R6), no live-browser/visual verification, and
  contrast was computed by formula rather than measured with DevTools — all recorded above, not
  silently skipped (Section 4).

Gate 8 evidence requirement ("verification.md includes evidence — commands + outputs and/or manual
checklist") is met by Sections 1–3; Section 4 preserves transparency about what was not verified.
