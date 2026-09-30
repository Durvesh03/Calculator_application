# Design Review — SCRUM-6: Color-Code Calculator Buttons

**Reviewer role:** Senior reviewer (Design Review stage)
**Inputs reviewed:** [requirements.md](requirements.md), [architecture.md](architecture.md), current [src/App.jsx](src/App.jsx) and [src/App.css](src/App.css)

## Summary

The proposed architecture is a CSS-only enhancement that introduces four visually distinct button categories (digit, operator, clear, equals) via CSS custom properties, plus a single new class hook (`className="operator"`) added to the four operator buttons in JSX. The approach is sound, minimal, and correctly avoids logic changes and new dependencies. One concrete defect was found and fixed during this review: the illustrative equals-button color pairing failed WCAG AA contrast. `architecture.md` has been updated in place to correct this and to close two smaller gaps (non-optional focus fallback, explicit decimal-button decision). With these updates, the design is approved to proceed to Implementation Planning.

## Strengths

- Correctly scopes the change to `src/App.css` plus a single, minimal `className` addition in `src/App.jsx` — no event handlers, state, or component structure touched.
- Verified against the actual source: operator buttons (÷ × − +) currently have no class at all, and `.clear`/`.equals`/`.zero` exist today only for grid-span layout — the architecture's premise matches reality.
- Uses CSS custom properties defined once, satisfying NFR-5 (maintainability) and NFR-3 (no new dependencies/frameworks).
- Explicitly calls out that contrast must be numerically verified rather than assumed, and includes a security section confirming no new attack surface.
- Correctly identifies that existing grid-span rules (`.clear { grid-column: span 2; }`, `.equals { grid-row: span 2; }`, `.zero { grid-column: span 2; }`) are layout-only and won't conflict with new color-only rules for the same classes (class selectors have equal specificity; properties don't overlap) — no layout regression risk.
- Addresses WCAG SC 1.4.1 (use of color) by noting button labels already convey meaning independent of color.

## Risks/Gaps (severity + mitigation)

| # | Risk/Gap | Severity | Mitigation / Decision |
|---|---|---|---|
| 1 | Illustrative equals-button pairing (`#ffffff` text on `#2979ff` background) computes to **≈3.99:1**, which fails the NFR-1/WCAG AA 4.5:1 minimum for normal text. The architecture doc had asserted this "comfortably clears 4.5:1," which is incorrect. | **High** | **Mitigate (applied).** Updated `architecture.md`'s illustrative palette to `#ffffff` on `#1565c0` (≈5.75:1, passes with margin) and corrected the accessibility narrative. Implementer must still re-verify the final chosen hex with a contrast tool. |
| 2 | Clear-button pairing (`#ffffff` on `#d32f2f`) computes to **≈4.98:1** — passes AA but with a narrow margin; any minor hex adjustment during implementation could regress below 4.5:1. | **Medium** | **Mitigate (documented).** `architecture.md` now states the computed ratio and flags it as a narrow margin requiring re-verification if the exact hex is changed. |
| 3 | The decimal button (`.`) has no dedicated class and was not explicitly discussed as a button category, even though it silently falls under the default `button` (digit) style. | **Low** | **Mitigate (applied).** Added an explicit statement in `architecture.md` that `.` intentionally shares the digit/default style, consistent with FR-1's intent. |
| 4 | The plan's `:focus-visible`-only rule was framed as optional with a "`:focus` fallback ... if broader browser support is desired." Since AC-5 is a hard acceptance criterion (visible focus state for keyboard users) and older Safari/browser versions do not support `:focus-visible`, treating the fallback as optional risks silently failing AC-5 in some browsers. | **Medium** | **Mitigate (applied).** `architecture.md` now specifies a mandatory `button:focus` rule plus `button:focus:not(:focus-visible) { outline: none; }` to suppress the ring for mouse users while guaranteeing it for keyboard/legacy-browser users. |
| 5 | Existing `.clear`/`.equals`/`.zero` classes will end up with two separate rule blocks (existing layout-only rules, new color-only rules) once implemented, which is functionally safe but could reduce readability. | **Low** | **Accept.** No functional risk (verified: specificity and properties don't conflict). Recommend implementer consolidate each class into one block for readability, but not a blocking requirement. |
| 6 | No missed button categories: digits, operators, clear, and equals are all accounted for; no button in the current JSX lacks a covering CSS rule. | Informational | **Accept.** Confirmed by reading `src/App.jsx` — all 19 buttons map cleanly to one of the four categories (or the digit/default fallback for `.`). |

## Decisions

1. **Class hook change (`className="operator"` on the four operator buttons) is accepted as safe and minimal.** It only adds a static attribute; `onClick` handlers, props, and component structure are unchanged. Verified directly against `src/App.jsx`.
2. **No new dependencies or logic changes are introduced** — confirmed against both `requirements.md` (NFR-3) and the actual `src/App.jsx`/`src/App.css` contents. Accepted as-is.
3. **Equals-button color corrected** from `#2979ff` to `#1565c0` (with white text) in `architecture.md` to meet WCAG AA contrast. This is a decision to fix the design artifact now, before implementation, rather than deferring and risking an AC-1–AC-4/NFR-1 failure discovered later.
4. **Focus-visible fallback made mandatory** (not optional) in `architecture.md` to guarantee AC-5 across browsers.
5. **Decimal button treated as part of the digit/default category** — an explicit, documented decision rather than an implicit fallback.
6. **Layout regression risk rejected as non-issue** — existing grid-span rules for `.clear`/`.equals`/`.zero` are untouched by the new color rules; verified there is no property or specificity conflict.

## Action Items

1. ~~Update `architecture.md` illustrative palette so the equals button passes WCAG AA contrast.~~ **Done** (changed to `#1565c0` background, ≈5.75:1).
2. ~~Correct the accessibility section's inaccurate claim about the equals-button contrast.~~ **Done**.
3. ~~Make the `:focus` fallback rule mandatory in the CSS structure, not optional.~~ **Done**.
4. ~~Document the decimal button's intentional grouping with the digit/default style.~~ **Done**.
5. During Implementation Planning/Implementation, re-verify final chosen hex values (especially clear and equals) with a contrast-ratio tool, since any last-minute palette tweak could regress the margins noted above.
6. During Implementation, confirm `:focus` / `:focus-visible` rendering manually (Tab through all buttons) as part of AC-5 verification, per the Verify stage.
