# Design Review — SCRUM-6: Color-code Calculator Buttons by Category

**Reviewed:** [requirements.md](requirements.md), [architecture.md](architecture.md)
**Reviewer role:** Senior design reviewer (architecture stage gate)

## 1. Summary

The proposed architecture is a minimal, purely presentational change: four CSS custom-property color tokens scoped to `.calculator`, plus `number`/`operator` class names added to button JSX (reusing existing `clear`, `equals`, `zero` classes). No component structure, state, handlers, layout grid, or the out-of-scope `eval()` logic are touched. The approach is sound, low-risk, and satisfies FR-1–FR-6 and NFR-1–NFR-3 as written.

Verification against the current [src/App.jsx](src/App.jsx) and [src/App.css](src/App.css) confirmed the architecture's file-impact claims are accurate (only digits/decimal/operator buttons currently lack a class; `clear`, `equals`, `zero` already exist; the hover rule is a generic `button:hover` selector unaffected by category classes).

Two contrast gaps were found in the originally proposed color tokens (equals-blue and clear-red backgrounds paired with white text) and have been **mitigated directly in architecture.md** by darkening those two token values. All other reviewed risks are accepted as-is with no architecture change needed.

## 2. Strengths

- Single source of truth for colors via CSS custom properties (NFR-1), scoped to `.calculator` to avoid global leakage.
- Reuses existing class-name pattern (`clear`, `equals`, `zero`) instead of introducing a new styling mechanism (inline styles, `data-*`, CSS-in-JS) — consistent with repo conventions.
- No changes to grid layout, spans, component state, or handlers — layout regression risk (NFR-3) is effectively eliminated by design.
- No new dependencies; no new attack surface (static class names only, no user input flows into styles).
- Correctly identifies and preserves the existing `button:hover { opacity: 0.8 }` rule as category-agnostic, satisfying FR-5/AC-5 without needing per-category hover rules.
- Explicitly documents the pre-existing `eval()` vulnerability as out-of-scope rather than silently ignoring it.

## 3. Risks / Gaps

| # | Risk / Gap | Severity | Details |
|---|---|---|---|
| R1 | Equals button contrast: original `#0a84ff` bg + `#ffffff` text ≈ **3.9:1**, below WCAG AA 4.5:1 for normal-size (22px, non-bold) text | Medium | Story explicitly excludes formal a11y/contrast ACs, but repo-wide guidance ("consider contrast" for UI work) and NFR-2 ("visually distinct... to avoid ambiguity") support tightening this at no scope cost. |
| R2 | Clear button contrast: original `#ff3b30` bg + `#ffffff` text ≈ **3.6:1**, below WCAG AA 4.5:1 | Medium | Same rationale as R1; the destructive/red intent (FR-4) can be preserved with a darker red shade. |
| R3 | Hover opacity interaction with new colored backgrounds | Low | `button:hover { opacity: 0.8 }` applies uniformly regardless of `background-color`; confirmed no per-category override is introduced. No functional break to FR-5/AC-5. |
| R4 | Zero button dual class (`className="number zero"`) — possible CSS specificity/property conflict | Low | Confirmed `.number` only sets color properties and `.zero` only sets `grid-column: span 2`; the two classes have equal specificity and non-overlapping properties, so combining them is safe. Class order in JSX is irrelevant to CSS application. |
| R5 | Consistency with existing dark theme (`#222` calculator bg, `#111` display bg) | Low | Neutral token (`#3a3a3c`) and the three accent colors are all lighter/more saturated than the dark theme backgrounds, preserving visual separation (NFR-2). No collision with existing colors. |
| R6 | Doc ambiguity: Overview said tokens live in "`:root`/`.calculator`" while the rest of the document commits to `.calculator`-only scoping | Low | Wording-only gap; no functional risk, but could mislead implementation into adding a global `:root` block. |

## 4. Decisions

| # | Decision | Rationale |
|---|---|---|
| R1 | **Mitigate** — darkened equals background from `#0a84ff` to `#0066cc` (~5.6:1 with white text) in architecture.md | Free fix (token value choice only); stays a clearly distinct "blue accent," satisfies FR-3 and improves contrast without adding new acceptance criteria or scope. |
| R2 | **Mitigate** — darkened clear background from `#ff3b30` to `#d32f2f` (~5.0:1 with white text) in architecture.md | Same as R1; color remains unambiguously red, satisfying FR-4, while meeting AA contrast as a side benefit. |
| R3 | **Accept as-is** | Verified against current [src/App.css](src/App.css) — the hover rule is generic and class-agnostic; no change required. |
| R4 | **Accept as-is** | Verified no overlapping CSS properties between `.number` and `.zero`; safe to combine. Recorded as an implementation/verification checkpoint (see Action Items) rather than an architecture change. |
| R5 | **Accept as-is** | Token values already checked against theme backgrounds; sufficient visual separation confirmed. |
| R6 | **Mitigate** — reworded architecture.md Overview bullet to state tokens are scoped to `.calculator` (not `:root`) | Small, unambiguous doc fix; removes risk of implementer adding an unintended global `:root` block. |

## 5. Action Items

- [ ] (Implementation) Apply `className="number"` to digit/decimal buttons and `className="operator"` to ÷ × − + buttons per architecture.md; ensure zero button becomes `className="number zero"`.
- [ ] (Implementation) Use the updated token values from architecture.md's Proposed Color Tokens table (`--color-equals-bg: #0066cc`, `--color-clear-bg: #d32f2f`), not the earlier `#0a84ff`/`#ff3b30` values.
- [ ] (Verify stage) Visually confirm the zero button renders both the 2-column grid span **and** the neutral number color.
- [ ] (Verify stage) Visually confirm hover opacity (0.8) still visibly darkens/lightens each of the four colored button categories.
- [ ] No further architecture changes anticipated; proceed to Implementation Planning.

## Architecture.md Updates Applied

- Clarified token scoping wording (`.calculator`, explicitly not `:root`) in the Overview section.
- Adjusted `--color-equals-bg` from `#0a84ff` → `#0066cc` and `--color-clear-bg` from `#ff3b30` → `#d32f2f` in the Proposed Color Tokens table, adding an approximate contrast-ratio column and a note explaining the change.
- Updated the Accessibility Considerations contrast note to reference the ~5:1+ estimates for all four categories.
