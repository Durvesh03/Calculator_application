# Implementation Plan — SCRUM-6: Calculator Button Color Coding

**Input:** `architecture.md` (as amended by `design-review.md` — decisions D1–D6, action items 1–6),
`requirements.md` (FR-1..FR-6, NFR-1..NFR-4, AC-1..AC-6).
**Scope guardrail:** This plan covers only the CSS-only, additive color-coding change described in
`architecture.md`. It does not include: logic changes, new dependencies, layout/grid changes, the
`eval()`/CWE-95 remediation, ARIA changes, or test-framework introduction — all explicitly out of scope
per `requirements.md` "Out of Scope" and `architecture.md` "Assumptions/Constraints".
**Files touched (per architecture.md, two files only):** `src/App.css` (new rules), `src/App.jsx`
(className attribute edits only).

## Dependency-Ordered Tasks

### T-1: Define category color variables on `:root` in `src/App.css`

- **What:** Add CSS custom properties on `:root` for the four category colors (digit, operator, clear,
  equals) and their hover/focus-visible/active/text-contrast variants, per architecture.md's Technology
  Choices (D3 — `:root`, not `.calculator`) and Accessibility Considerations (need variants for hover,
  `:focus-visible`, `:active`, plus a text color per category for contrast).
- **Why first:** Every subsequent CSS rule (T-2..T-5) and the contrast check (T-6) reference these
  variables. Defining them first avoids rework and keeps the palette centralized, as architecture.md
  requires.
- **Depends on:** Nothing (first code change).
- **Architecture traceability:** Technology Choices (CSS custom properties on `:root`), D3.

### T-2: Add `digit` category class rules in `src/App.css`

- **What:** Add a `.digit` selector block (`background-color`, `color`) plus `.digit:hover`,
  `.digit:focus-visible`, `.digit:active` rules, using the variables from T-1. Do not touch `.zero`'s
  existing `grid-column: span 2` rule — `digit` is additive alongside it.
- **Depends on:** T-1 (variables must exist first).
- **Architecture traceability:** FR-1/AC-1, Accessibility Considerations (focus-visible + active per
  category), Component List row "Digit/decimal buttons".

### T-3: Add `operator` category class rules in `src/App.css`

- **What:** Add a `.operator` selector block plus `:hover`/`:focus-visible`/`:active` variants, using T-1
  variables.
- **Depends on:** T-1. Independent of T-2 (different selector), but sequenced after it for a single
  reviewable "add new category classes" commit; no functional dependency between T-2 and T-3.
- **Architecture traceability:** FR-2/AC-2, Component List row "Operator buttons".

### T-4: Extend existing `.clear` rule with color in `src/App.css`

- **What:** Add `background-color`, `color`, `:hover`, `:focus-visible`, `:active` declarations to the
  existing `.clear` block (which today only has `grid-column: span 2`). Reuse `.clear` directly — do not
  introduce a second class, per D2.
- **Depends on:** T-1 (variables). Independent of T-2/T-3 but sequenced after them since T-2/T-3 establish
  the pattern this task mirrors for a class that already exists.
- **Architecture traceability:** FR-3/AC-3, D2, Component List row "Clear button".

### T-5: Extend existing `.equals` rule with color in `src/App.css`

- **What:** Same treatment as T-4 but for `.equals` (which today only has `grid-row: span 2`).
- **Depends on:** T-1. Independent of T-4; grouped adjacently since both are "extend an existing
  structural class" tasks (D2).
- **Architecture traceability:** FR-4/AC-4, D2, Component List row "Equals button".

### T-6: Manual contrast spot-check of all category color combinations

- **What:** Using browser DevTools' contrast checker (or equivalent) on each category's normal, hover,
  focus-visible, and active text-on-background pairing, confirm ≥4.5:1 contrast (WCAG AA, normal text).
  Adjust the hex values behind the T-1 variables if any combination fails, then re-check.
- **Depends on:** T-1 through T-5 (all category colors must be defined and applied to check them
  meaningfully; this task loops back to adjust T-1's variable values if needed, not to add new rules).
- **Architecture traceability:** NFR-1, Accessibility Considerations (4.5:1 contrast target, D5),
  design-review.md Action item 3.

### T-7: Add `digit` class to digit/decimal buttons in `src/App.jsx`

- **What:** Add `className="digit"` to buttons for `1`–`9` and `.` (decimal), and `className="zero digit"`
  (space-separated, per D4) to the `0` button, preserving its existing `.zero` structural class exactly as
  is. No changes to `onClick` handlers or JSX structure otherwise.
- **Depends on:** T-2 (the `.digit` CSS rule must exist for this to have visible effect; sequencing the CSS
  rule before the JSX class keeps each commit visually verifiable, though technically JSX/CSS order is not
  build-breaking either way).
- **Architecture traceability:** FR-1/AC-1, Technology Choices (className concatenation pattern, D4),
  design-review.md Action item 1.

### T-8: Add `operator` class to operator buttons in `src/App.jsx`

- **What:** Add `className="operator"` to the four operator buttons (`÷`, `×`, `−`, `+`). No handler
  changes.
- **Depends on:** T-3 (the `.operator` CSS rule).
- **Architecture traceability:** FR-2/AC-2, design-review.md Action item 1.

### T-9: Verify no JSX changes needed for Clear/Equals

- **What:** Confirm (no edit expected) that `C` and `=` buttons keep their existing `className="clear"` /
  `className="equals"` unchanged — per D2 there is no second class to add. This is a checkpoint, not a
  code change; include it explicitly so the task list matches architecture.md's action item 1 in full and
  nobody accidentally adds a redundant class.
- **Depends on:** T-4, T-5 (CSS already colors `.clear`/`.equals` directly).
- **Architecture traceability:** D2, design-review.md Action item 1 ("No class changes needed for `C`/`=`").

### T-10: Build and lint check

- **What:** Run `npm run build` (`vite build`) and `npm run lint` (`oxlint`) after all CSS/JSX edits.
  Confirm both pass with no new errors/warnings.
- **Depends on:** T-1 through T-9 (all source edits complete).
- **Architecture traceability:** NFR-4, Error Handling Approach ("Build/lint safety"), design-review.md
  Action item 4.

### T-11: Manual functional and accessibility regression pass

- **What:** In a running dev build (`npm run dev`), manually exercise AC-1 through AC-6: visually confirm
  the four category colors are consistent and distinct; hover each button category and confirm visible
  feedback (AC-5); Tab through all 18 buttons with keyboard only and confirm a visible `:focus-visible`
  indicator on every category; click/Enter-activate a few buttons of each category and confirm `:active`
  feedback; perform addition, subtraction, multiplication, division, clear, and decimal entry to confirm
  identical behavior to before the change (AC-6, no functional regression).
- **Depends on:** T-10 (build/lint must pass first so the dev server reflects a clean state).
- **Architecture traceability:** AC-1..AC-6, Accessibility Considerations, Error Handling Approach ("No
  functional regression"), design-review.md Action item 5.

## Dependency Graph Summary

```
T-1 (root variables)
 ├─> T-2 (digit CSS)   ─┐
 ├─> T-3 (operator CSS) ─┤
 ├─> T-4 (clear CSS)    ─┼─> T-6 (contrast spot-check, may loop back to T-1)
 └─> T-5 (equals CSS)   ─┘
T-2 ─> T-7 (digit className in JSX)
T-3 ─> T-8 (operator className in JSX)
T-4, T-5 ─> T-9 (verify no clear/equals JSX change)
T-6, T-7, T-8, T-9 ─> T-10 (build + lint)
T-10 ─> T-11 (manual functional + a11y regression pass)
```

Note: T-2..T-5 have no dependency on each other (independent selectors) and could be done in any order or
combined into one CSS-editing pass; they are listed sequentially only to mirror the Component List order
in architecture.md and to keep each category's diff easy to review independently.

## Suggested Commit Breakdown

1. **Commit 1 — "Add category color CSS variables and rules"**: T-1, T-2, T-3, T-4, T-5 (all `src/App.css`
   changes: root variables + digit/operator/clear/equals color rules with hover/focus-visible/active).
   Rationale: keeps all new CSS in one reviewable diff against `src/App.css`; nothing here is visible in
   the UI yet until className changes land, so bundling is low-risk.
2. **Commit 2 — "Apply category classes to calculator buttons"**: T-7, T-8, T-9 (all `src/App.jsx`
   className additions). Rationale: isolates the JSX diff (the only file where a typo could silently break
   a button's styling) from the CSS diff, making it trivial to `git diff` and confirm exactly which buttons
   changed and that no `onClick`/structural class was touched.
3. **(No commit for T-6)**: contrast spot-check is a verification step; if it requires hex adjustments,
   fold those adjustments back into Commit 1 (amend before commit, or a small follow-up commit
   "Adjust category colors for 4.5:1 contrast" if Commit 1 was already made — prefer amending before first
   commit if caught early).
4. **(No commit for T-10/T-11)**: build/lint run and manual verification are checks, not code changes; their
   results are recorded in `verification.md` in the Verify stage, not as separate commits here.

## Verification Approach

**Automated (what to run):**
- `npm run build` — must complete with no new errors (NFR-4).
- `npm run lint` — `oxlint` must report no new warnings/errors (NFR-4).
- No unit/integration test suite exists in this repo (confirmed via `package.json` — only `dev`, `build`,
  `lint`, `preview` scripts); this is a pre-existing condition, not something this change should introduce
  a framework to fix (per design-review.md R6 — out of scope).

**Manual (what to validate):**
- Visual: digit/decimal buttons share one consistent color distinct from operator, clear, and equals
  (AC-1); operator buttons share one consistent color distinct from the others (AC-2); Clear is distinct
  (AC-3); Equals is distinct (AC-4).
- Interaction states: hover shows visible feedback on every button (AC-5, FR-5); keyboard Tab navigation
  shows a visible `:focus-visible` indicator on every button category (Accessibility Considerations);
  mouse/touch/Enter-Space activation shows visible `:active` feedback on every category.
- Contrast: spot-check each category's normal/hover/focus/active text-on-background pairing at ≥4.5:1
  using a DevTools contrast checker (NFR-1, D5).
- Functional regression: addition, subtraction, multiplication, division, clear, and decimal entry all
  produce the same results as before the change (AC-6, FR-6) — click through at least one full expression
  per operator plus a clear and a decimal-entry case.
- Layout: confirm `.clear` (span 2), `.equals` (row span 2), `.zero` (span 2) grid placement is visually
  unchanged (NFR-3) — only color should differ from the current screenshot/baseline.

Results of both automated and manual checks should be recorded in `verification.md` in the Verify stage,
per Gate 8, not in this document.

## Blockers/Assumptions

- **No blockers identified.** All inputs (architecture.md, design-review.md, requirements.md, current
  `src/App.jsx`/`src/App.css`) are available and internally consistent; no open questions remain
  unresolved (requirements.md's two Open Questions are already resolved, and design-review.md's six
  risks/gaps are already closed via architecture.md amendments D1–D6).
- **Assumption (inherited from architecture.md):** Exact hex values for each category color are an
  Implementation-stage decision, not fixed by this plan or by architecture.md — T-1 defines the variable
  *names* and *roles* (base/hover/focus/active/text per category); the Implementation stage chooses the
  literal values, subject to the T-6 contrast check.
- **Assumption:** No test framework will be introduced as part of this work (design-review.md R6); manual
  verification per T-11 is the only regression check for AC-6, consistent with the repo's pre-existing lack
  of a test runner.
- **Assumption:** `.clear` and `.equals` are extended in place (T-4, T-5) rather than paired with a new
  class, per D2 — if a future story needs to decouple layout from color for these two buttons, that is an
  explicit out-of-scope refactor for this plan.
- **Assumption:** This plan does not itself modify `src/App.jsx` or `src/App.css` — those edits belong to
  the Implementation stage; this document only sequences and scopes them.
