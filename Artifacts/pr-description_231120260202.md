# PR Description — SCRUM-6: Enhance Calculator application (color-coded buttons)

**Base branch:** `main`
**Compare branch:** `claude-capstone-with-artifacts`
**Commits (4, oldest → newest):**
- `5310719` fix(security): replace eval() with switch-based operator dispatch (CWE-95)
- `c07996a` feat(ui): add color-coded button categories to calculator (SCRUM-6)
- `6817f6c` fix(calculator): handle divide-by-zero and unknown operator in calculate()
- `a1a7a46` test(calculator): add Vitest unit tests for calculate()

---

## 1. Summary

This PR implements SCRUM-6 by adding color-coded button categories (number / operator / clear / equals) to the calculator UI via CSS custom-property tokens, with a shared `:focus-visible` outline for accessibility. Along the way it also removes a `CWE-95` dynamic-code-evaluation vulnerability (`eval()`) from `calculate()`, hardens `calculate()` against divide-by-zero and unknown operators, and adds a Vitest unit-test suite covering that logic — so the feature ships together with the security fix and regression coverage it depends on.

## 2. Changes Made

- **`src/App.jsx`** (modified, all 4 commits) — replaced `eval()`-based expression evaluation with a switch-based `calculate()` dispatch (CWE-95 fix); wired button markup to new color-category CSS classes; later refactored to import `calculate()` from the extracted `src/calculate.js` module.
- **`src/App.css`** (modified, `c07996a`) — added CSS custom-property tokens and distinct color treatments for number/operator/clear/equals buttons, plus a shared `:focus-visible` outline; preserves existing hover feedback and grid layout.
- **`src/calculate.js`** (added, `a1a7a46`) — extracted `calculate()` into its own module so it is independently unit-testable; includes the divide-by-zero → `"Error"` and unknown-operator → throw behavior from `6817f6c`.
- **`test_scripts/calculate.test.ts`** (added, `a1a7a46`) — Vitest suite covering all 4 operators, both divide-by-zero cases, and the unknown-operator throw.
- **`package.json`** (modified, `a1a7a46`) — added `vitest` dev dependency and `test` script to run the new suite.
- **`package-lock.json`** (modified, `a1a7a46`) — lockfile update accompanying the `vitest` dev dependency addition.

**Dependency note:** the only new dependency introduced is `vitest` (dev-only, test runner) — flagged here per the dependency guardrail; no runtime/production dependency was added.

## 3. Test Evidence

Source: `Artifacts/verification_231120260201.md` (Gate 8 — Verify).

Automated commands — clean, full output captured in the verification artifact:

```
npm run lint        → oxlint: clean, no warnings/errors
npm run build        → vite build: ✓ 18 modules transformed, ✓ built in 110ms
npm test             → vitest run: Test Files 1 passed (1), Tests 7 passed (7)
```

The 7/7 Vitest suite (`test_scripts/calculate.test.ts`) is the same suite reviewed PASS in `Artifacts/code-review_231120260125.md` (all 7 review areas PASS, 0 open findings) and covers all 4 operators, both divide-by-zero cases, and the unknown-operator throw path.

UI/Playwright evidence (honest status — **not** fully executed):
- **IT-5 (chained operator calc: 6−2=4, then ×3=12) — PASS**, with captured Playwright evidence ("IT-5 PASS: display shows '12'").
- **16 of 17 scripted UI test cases (UT-1…UT-10, IT-1…IT-4, IT-6, IT-7) — Not Executed.** The user explicitly instructed the Playwright test run to stop early ("stop the testing, this is enough, now move ahead") before per-test evidence was captured for these cases. Per the verification guardrail, these are recorded as Not Executed rather than assumed PASS.

## 4. Known Limitations

- **16 of 17 UI test cases Not Executed:** UT-1…UT-10 (single-interaction/visual behaviors, incl. the button-color/contrast and hover checks for AC-1–AC-6) and IT-1…IT-4, IT-6, IT-7 (end-to-end calculation flows) were defined in `Artifacts/unit-tests_231120260146.md` / `Artifacts/integration-tests_231120260146.md` but not executed with captured evidence, because the user explicitly stopped the Playwright run early. This is an accepted, user-directed stopping point, not a silent gap — see `Artifacts/verification_231120260201.md` §2 and §4.
- **`npm audit` dev-tooling advisories on `vite`:** pre-existing advisories were flagged during the security pass but are dev-only (build tooling, not shipped runtime code) and out of scope for this PR.
- No regression is expected given the CSS/markup changes are additive and code-reviewed PASS, and the only logic change (`calculate()`) has 7/7 passing unit tests plus a clean build/lint — but this is a reasoned risk assessment, not a substitute for the skipped UI checks above.

## 5. Reviewer Checklist

- [ ] Visually verify the 4 button categories (number / operator / clear / equals) render with the approved color palette.
- [ ] Verify visible hover and `:focus-visible` keyboard-focus outline on all button categories.
- [ ] Run the app and confirm `2 + 3 = 5`.
- [ ] Run the app and confirm `5 / 0 =` displays `Error` (not `Infinity`/`NaN`).
- [ ] Confirm no `eval()` remains anywhere in `src/` (CWE-95 fix intact).
- [ ] Confirm `npm test` passes (Vitest, 7/7).
- [ ] Confirm `npm run lint` and `npm run build` are clean.
- [ ] Acknowledge the 16 Not-Executed UI test cases as a known, user-accepted limitation before approving (see Known Limitations above).

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
