# Code Review — SCRUM-6 (Button Color Coding) + `eval()` Security Fix

**Reviewer role:** Peer reviewer (sdlc-code-review)
**Scope reviewed:** Uncommitted working-tree changes to `src/App.jsx` and `src/App.css` on branch
`claude-capstone`, covering:
1. Security fix: `calculate()` changed from `eval()` string evaluation to an explicit `switch` statement
   (per `security-remediation.md`).
2. SCRUM-6 feature: category-based button color coding — `digit` / `operator` / `.clear` / `.equals` CSS
   classes, `:root` color variables, and `:hover` / `:focus-visible` / `:active` states (per
   `requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`).

**Reference docs consulted:** `requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`,
`security-remediation.md`.

**Out of scope for this review:** `.env.example` and `.mcp.json` (also uncommitted in this working tree)
are unrelated to SCRUM-6/the security remediation and were only skimmed for obvious secret leakage (none
found — only placeholder env-var names/blank values); they are not part of the checklist below.

---

## Checklist

| # | Review Area | Verdict | Notes |
|---|---|---|---|
| 1 | Correctness (matches `requirements.md` FR/AC) | **PASS** | See §1. One non-blocking observation (focus vs. hover color values). |
| 2 | Security (secrets excluded, no eval/injection reintroduced) | **PASS** | See §2. No unresolved security concerns. |
| 3 | Error Handling (N/A justification if none needed) | **PASS (N/A, justified)** | See §3. |
| 4 | Test Coverage (no test framework exists — pre-existing, per `design-review.md` R6) | **PASS (N/A, pre-existing gap, documented)** | See §4. |
| 5 | Code Clarity | **PASS** | See §5. |
| 6 | DRY Principle | **FAIL → FIXED** | See §6 — concrete duplicated CSS declarations across four category blocks; fix applied post-review (see Follow-up). |
| 7 | Dependency Safety (npm audit already clean per `security-remediation.md`) | **PASS** | See §7. |

**Overall:** No unresolved security concerns — the guardrail condition for withholding approval does not
apply. However, this review is **not a clean pass**: item 6 (DRY) is a genuine FAIL with a concrete,
low-risk fix. Recommend addressing §6 before merge; everything else is ready.

---

## 1. Correctness — PASS

Verified against `requirements.md` FR-1..FR-6 / AC-1..AC-6:

- **FR-1/AC-1:** All digit buttons (`1`–`9`, decimal `.`) get `className="digit"`; `0` gets
  `className="zero digit"` (space-separated, per D4 in `design-review.md`). One consistent color group. ✔
- **FR-2/AC-2:** All four operator buttons (`÷ × − +`) get `className="operator"`. ✔
- **FR-3/AC-3:** `.clear` (`C` button) extended in place with color rules, no second class — matches D2. ✔
- **FR-4/AC-4:** `.equals` (`=` button) extended in place with color rules, no second class — matches D2. ✔
- **FR-5/AC-5:** The original global `button:hover { opacity: 0.8; }` rule is untouched, and each new
  `.digit:hover` / `.operator:hover` / `.clear:hover` / `.equals:hover` rule only sets `background-color`
  (no `opacity` override), so both the pre-existing opacity dim and the new per-category background-color
  shift apply together on hover. Hover feedback is preserved for every button. ✔
- **FR-6/AC-6 (no functional regression):** `calculate()`'s new `switch` produces numerically identical
  results to the old `eval(`${first}${operator}${second}`)` for all four operators, including
  division-by-zero (`x/0 → Infinity`, `0/0 → NaN`) and negative operands — confirmed by manual trace (e.g.
  `first=5, second=-3, operator="+"` → old: `eval("5+-3")=2`; new: `5+(-3)=2`). No `onClick` handler,
  state, or JSX structure changed besides `className` additions. ✔
- Layout-only classes (`.clear` span-2, `.equals` row-span-2, `.zero` span-2) are untouched — NFR-3
  preserved. ✔

**Non-blocking observation:** `architecture.md`'s Accessibility Considerations section states the
`:focus-visible` treatment "should be visually related to (but not identical to) each category's `:hover`
treatment." In the implementation, `--color-*-bg-focus` is set to the exact same hex value as
`--color-*-bg-hover` for all four categories (e.g. `--color-digit-bg-hover: #5c5c5c` and
`--color-digit-bg-focus: #5c5c5c`). The two states are only distinguished by the added `outline`. This is a
minor deviation from the architecture's stated preference, not a violation of any FR/AC, so it does not
change the PASS verdict — noting it for awareness only.

## 2. Security — PASS

- **`eval()` removed:** `calculate()` no longer builds/evaluates a string expression. Confirmed no
  `eval(`, `new Function(`, or other dynamic-code-execution call remains in the diff or the surrounding
  file. This matches the fix documented in `security-remediation.md` (CWE-95 / OWASP A03:2021).
- **No injection reintroduced:** The `switch` dispatches only on the four literal operator strings the app
  itself controls (`"+" "-" "*" "/"`); the `default` case returns `second` rather than throwing or
  evaluating anything — no new code path executes arbitrary input.
- **Secrets:** No secrets, tokens, or credentials appear in `src/App.jsx` or `src/App.css`.
- **No user input flows into CSS or into dynamically executed code** — category class names are static,
  developer-authored strings; no runtime/user data is used to build a class name, a style, or an evaluated
  expression.

No unresolved security concerns remain in this diff.

## 3. Error Handling — PASS (N/A, justified)

This is a styling change plus a like-for-like arithmetic dispatch swap; no new failure surface is
introduced:

- The `switch` statement's `default: return second;` is unreachable in practice (all four call sites only
  ever pass an internally-controlled operator), so it is a safe fallback rather than a masked error —
  acceptable given `calculate()`'s only callers are `inputOperator` and `handleEquals`, both of which set
  `operator` from a fixed internal set.
- No new I/O, network calls, file access, or parsing of external input is introduced by either the security
  fix or the CSS/JSX changes, so there is nothing new to handle. This matches the "no new failure modes"
  justification already documented in `architecture.md`'s Error Handling Approach section.

## 4. Test Coverage — PASS (N/A, pre-existing gap, already documented)

- Confirmed via `package.json`: only `dev`, `build`, `lint`, `preview` scripts exist — no test runner/
  framework is present in the repo at all. This is a pre-existing condition, not something introduced or
  worsened by this diff, and is already explicitly documented as Risk R6 in `design-review.md` ("No
  automated regression coverage exists for AC-6 ... pre-existing repo condition, not introduced or worsened
  by this change").
- No claim is made that automated tests cover the new `switch` logic or the new CSS classes; verification
  for both is intended to be manual (per `impl-plan.md` T-11 and `security-remediation.md`'s manual
  numeric spot-check), consistent with the repo's existing verification approach.

## 5. Code Clarity — PASS

- `calculate()`: the `switch` is easy to follow without comments, and the retained comment clearly explains
  *why* the code changed (previous vulnerability) and what behavior is preserved (division semantics).
- CSS: each category block (`digit`, `operator`, `.clear`, `.equals`) follows an identical, predictable
  structure (`base` → `:hover` → `:focus-visible` → `:active`), and the `:root` variables are grouped and
  commented by category, making the palette easy to scan and modify.
- JSX: `className` additions are minimal, single-purpose string literals (`"digit"`, `"operator"`,
  `"zero digit"`); no new conditional class logic was introduced, keeping every button's markup
  self-explanatory.

## 6. DRY Principle — FAIL

`src/App.css` repeats several **identical** declarations across all four category blocks, where the
duplicated code is not category-specific and could be factored into one shared rule without touching any
category's actual color values:

- `:focus-visible` — the same `outline: 3px solid var(--color-focus-outline); outline-offset: 2px;` pair
  appears verbatim in `.digit:focus-visible`, `.operator:focus-visible`, `.clear:focus-visible`, and
  `.equals:focus-visible` (lines 92–96, 112–116, 133–137, 154–158). Only the `background-color` line
  actually differs per category.
- `:active` — the same `transform: scale(0.97);` appears verbatim in `.digit:active`, `.operator:active`,
  `.clear:active`, `.equals:active` (lines 98–101, 118–121, 139–142, 160–163). Only the `background-color`
  line differs per category.

**Concrete fix:** split each category's `:focus-visible`/`:active` block into (a) a shared, comma-grouped
selector for the identical declarations, and (b) the category-specific `background-color` line, e.g.:

```css
.digit:focus-visible,
.operator:focus-visible,
.clear:focus-visible,
.equals:focus-visible {
  outline: 3px solid var(--color-focus-outline);
  outline-offset: 2px;
}

.digit:active,
.operator:active,
.clear:active,
.equals:active {
  transform: scale(0.97);
}

.digit:focus-visible   { background-color: var(--color-digit-bg-focus); }
.operator:focus-visible{ background-color: var(--color-operator-bg-focus); }
.clear:focus-visible    { background-color: var(--color-clear-bg-focus); }
.equals:focus-visible   { background-color: var(--color-equals-bg-focus); }

.digit:active    { background-color: var(--color-digit-bg-active); }
.operator:active { background-color: var(--color-operator-bg-active); }
.clear:active     { background-color: var(--color-clear-bg-active); }
.equals:active    { background-color: var(--color-equals-bg-active); }
```

This removes 6 duplicated declaration pairs (2 lines × 4 categories → 1 shared rule of 2 lines) with no
behavior change, no new dependency, and no violation of NFR-2 (still plain CSS). Not a security issue and
not required by any FR/AC, but it is duplicated logic that should be refactored per the DRY checklist
question ("is there duplicated logic that Claude can refactor into a shared function?").

## 7. Dependency Safety — PASS

- `security-remediation.md` records `npm audit` as clean (0 vulnerabilities across all 67 production/dev/
  optional dependencies) as of this branch.
- This diff (`src/App.jsx`, `src/App.css`) introduces **no new npm packages** — confirmed by inspecting
  `package.json` (unchanged: `react`, `react-dom` as dependencies; `oxlint`, `vite`, `@vitejs/plugin-react`,
  `@types/react*` as devDependencies) and the diff itself, which touches only two existing source files
  with plain CSS/JSX. No new supply-chain surface is introduced.

---

## Summary of Required Follow-up

- **§6 DRY — RESOLVED.** The identical `:focus-visible` outline/offset and `:active`
  `transform: scale(0.97)` declarations were de-duplicated into shared comma-grouped selectors in
  `src/App.css`, leaving only the per-category `background-color` lines separate. Re-ran `npm run build`
  and `npm run lint` after the fix — both pass with no new errors/warnings. No behavior change.
- **No security follow-up required.** The `eval()` → `switch` fix is complete, verified, and does not
  reintroduce any dynamic-code-execution or injection surface.
- **No action required** for Error Handling or Test Coverage — both are legitimately N/A/pre-existing and
  already documented in the referenced design docs.

All findings from this review are now addressed. Ready to proceed to Verify.
