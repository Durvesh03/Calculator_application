# Design Review — SCRUM-6: Calculator Button Color Coding

**Reviewer role:** Senior reviewer (sdlc-design-review)
**Input reviewed:** `architecture.md` (against `requirements.md`, `src/App.jsx`, `src/App.css`)
**Verdict:** Approved **with amendments** — `architecture.md` was updated during this review (see "Decisions"
and "Changes made to architecture.md" below) to close gaps found during review. Not a silent approval.

## 1. Summary

The architecture proposes a CSS-only, additive styling change: add category `className`s (digit, operator,
clear, equals) to the existing 18 buttons in `src/App.jsx` and define category colors (via CSS custom
properties) plus hover treatment in `src/App.css`. No state, handlers, `calculate()`, routing, or
dependencies are touched. Scope, file list, and non-functional constraints (NFR-2 plain CSS, NFR-3 layout
preserved, NFR-4 build/lint) match `requirements.md` and the real code in `src/App.jsx`/`src/App.css`
verified during this review.

The core design is sound and low-risk: it correctly maps all 18 buttons to one of the four categories,
correctly identifies which buttons currently have no class at all (digits, decimal, operators) versus which
already carry a structural class that must be preserved (`.clear`, `.equals`, `.zero`), and correctly scopes
the "no functional regression" argument to the fact that no `onClick`/state code is touched. The main gap
found was an accessibility gap: the original draft mentioned "hover/focus treatments" once in the Overview
but never followed through with an actual focus design, an active/pressed state, or a concrete contrast
number — despite Gate 2 explicitly requiring "a11y considerations for UI work" and the repo-wide guardrail
to "implement hover/active/focus; maintain visible keyboard focus." That gap, plus two smaller ambiguities
(whether `.clear`/`.equals` get a second class or are reused directly; where CSS variables live), have been
resolved by editing `architecture.md` directly (see Decisions).

## 2. Strengths

- **Correctly scoped to two files, no logic touch.** Cross-checked against `src/App.jsx`/`src/App.css`:
  the doc's claim that digits, decimal, and operator buttons currently carry no class, while `.clear`,
  `.equals`, `.zero` are structural-only, is accurate. The "no state/handler edits" claim is verifiable —
  `calculate`, `inputNumber`, `inputOperator`, `handleEquals`, `clearCalculator`, `handleDecimal` are
  untouched by the proposal.
- **Explicit non-goals honored.** Correctly leaves the known `eval()`-based CWE-95 risk in `calculate()`
  out of scope rather than opportunistically touching it, matching `requirements.md`'s Out of Scope list.
- **Graceful degradation designed in.** Category rules are additive on top of the existing base `button {}`
  rule, so a missing/mistyped class degrades to today's uniform look instead of an unstyled button — a
  sensible defensive default for a CSS-only change.
- **Traceable to FR/AC.** Every row in the Component List cites the specific FR/AC it satisfies (FR-1..FR-6,
  AC-1..AC-6), which makes it easy to verify coverage is complete — all 6 ACs are addressed somewhere in the
  document.
- **Correctly treats exact hex values as an implementation detail**, consistent with the resolved Open
  Question 1 in `requirements.md` (standard convention approved, not a specific brand palette) — the
  architecture doesn't over-specify a decision that belongs to a later stage.
- **No new dependency/build-surface risk.** Correctly reasons that `vite build`/`oxlint` are unaffected
  since no new JS expressions, props, or imports are introduced.

## 3. Risks/Gaps

| # | Risk/Gap | Severity | Mitigation |
|---|---|---|---|
| R1 | **Accessibility under-specified for a UI-styling story.** Original draft only name-dropped "hover/focus treatments" once (Overview) with no actual focus design, no `:active` state, and no concrete contrast number — despite Gate 2 requiring a11y considerations for UI work and the repo guardrail to implement hover/active/focus with visible keyboard focus. Risk: implementer ships color changes with no visible keyboard-focus indicator on a dark background, which is a real regression for keyboard users even though no AC explicitly tests it. | **High** — violates an explicit process gate (Gate 2) and a repo-wide UI guardrail, not just a style nicety. | **Resolved in this review**: added a new "Accessibility Considerations" section to `architecture.md` specifying (a) an explicit `:focus-visible` rule per category distinct from the dark card background, (b) an `:active` pressed state, and (c) a concrete 4.5:1 contrast target with a manual DevTools spot-check step. The manual verification note in "Error Handling Approach" now explicitly includes a keyboard-Tab focus check. |
| R2 | **Ambiguous class strategy for Clear/Equals.** Original wording ("add color rules scoped to `.clear` (or a paired category class)") left it open whether `.clear`/`.equals` are reused directly for color or paired with a new dedicated class like `.digit`/`.operator` get. Left undecided, two different developers could implement this inconsistently, and future refactors that split layout from color would be harder to reason about. | **Low** — cosmetic/maintainability risk only, no functional impact; both options satisfy the ACs. | **Resolved in this review**: `architecture.md` now states the decision explicitly — reuse `.clear`/`.equals` directly for color (no second class), since each already uniquely targets exactly one button. |
| R3 | **No concrete contrast target.** "WCAG AA as best-effort" (per resolved Open Question 2) is directionally correct but gave the implementer no actual number to check against, so "best effort" could mean anything from "glanced at it" to "measured it." | **Medium** — directly affects NFR-1 (label legibility) and is easy to get wrong with amber/orange-on-dark or red-on-dark combinations. | **Resolved in this review**: architecture.md now states a specific 4.5:1 minimum contrast ratio (WCAG AA for normal text) and a manual DevTools-contrast-checker spot-check step during Implementation, still non-blocking/manual per the resolved open question (not upgraded to an automated gate, since that would exceed this story's approved scope). |
| R4 | **CSS custom property scope left ambiguous** (`:root` *or* `.calculator`). Functionally both work today (single instance of `.calculator`), but leaving it open invites inconsistent authoring and unnecessary rediscovery work later. | **Low** — no functional or a11y impact today; purely a consistency/maintainability concern. | **Resolved in this review**: architecture.md now pins this to `:root`, with rationale (single global fixed palette, no per-instance theming need). |
| R5 | **Multi-class concatenation mechanics not shown.** The doc said the category class is "kept alongside `.zero` where present" but never showed how (e.g., `className="zero digit"` vs. a template literal helper), which is a small but real source of implementation inconsistency across ~14 button JSX edits. | **Low** — purely a clarity gap; any reasonable implementation choice is compatible with plain JSX. | **Resolved in this review**: architecture.md's Technology Choices section now gives the explicit pattern (`className="zero digit"`, space-separated string, no helper needed). |
| R6 | **No automated regression coverage exists for AC-6** (no functional regression) — confirmed via `package.json`: there is no test runner/framework in this repo at all, so "manual/visual check plus build/lint" is genuinely the only verification available, not a shortcut the architecture is taking. | **Low** (pre-existing repo condition, not introduced or worsened by this change) — flagged for transparency, not as a defect of this architecture. | No change needed to architecture.md — out of scope for a CSS-only story to introduce a test framework. Mitigation is procedural: the Implementation/Verify stages must explicitly exercise all six ACs (arithmetic ops, clear, decimal) manually and record the check in `verification.md`, per Gate 8. |

## 4. Decisions

- **D1 — Accessibility section added.** `architecture.md` now has a dedicated "Accessibility Considerations"
  section (focus-visible, active state, 4.5:1 contrast target, no-ARIA-change rationale). This directly
  closes the Gate 2 a11y requirement that was previously satisfied only in passing language.
- **D2 — Clear/Equals reuse their existing classes for color** (no new `.clear-btn`/`.equals-btn`
  pairing); only digit and operator buttons receive brand-new category classes (`digit`, `operator`), since
  they currently have none.
- **D3 — CSS variables live on `:root`**, not `.calculator`, since the palette is global and single (no
  theming requirement in scope).
- **D4 — className concatenation pattern is a plain space-separated string** (e.g. `className="zero digit"`)
  — no helper/utility needed given categories are static per button.
- **D5 — Contrast bar is fixed at 4.5:1 (WCAG AA, normal text)**, checked manually with browser DevTools
  during Implementation; this remains a manual/non-blocking check, consistent with the already-resolved
  Open Question 2 in `requirements.md` (not re-opening that decision, just making "best effort" concrete
  enough to be checkable).
- **D6 — Exact hex values remain deferred to Implementation**, as originally proposed; this review found no
  reason to pull that decision earlier, since Open Question 1 already resolved the *convention* (neutral
  gray/amber/red/accent) and picking literal hex codes is a reversible, low-risk implementation detail.

## 5. Action items

1. **[Implementation]** Add `digit` class to all digit (`0`–`9`) and decimal (`.`) buttons in `src/App.jsx`
   (concatenated with `.zero` on the zero button per D4), and `operator` class to `÷`/`×`/`−`/`+`. No class
   changes needed for `C`/`=` (D2).
2. **[Implementation]** In `src/App.css`, define category color variables on `:root` (D3) and rules for
   `digit`, `operator`, `.clear`, `.equals`, each with `background-color`, `color` (text), `:hover`,
   `:focus-visible`, and `:active` variants per the new Accessibility Considerations section.
3. **[Implementation]** Spot-check each category's normal/hover/focus/active text-on-background contrast
   at ≥4.5:1 using a DevTools contrast checker (D5); adjust hex values if any combination fails.
4. **[Implementation/Verify]** Run `npm run build` and `npm run lint` after the CSS/JSX edits to confirm
   NFR-4 (no new console errors, build/lint still pass).
5. **[Verify]** Manually exercise AC-1 through AC-6, including a keyboard-only (Tab) pass to confirm every
   button category shows a visible `:focus-visible` state, and record the results in `verification.md`
   (per Gate 8 and R6's mitigation).
6. **[Process]** No action needed on R6 beyond the procedural verification note above — no test framework
   introduction is in scope for this story.
