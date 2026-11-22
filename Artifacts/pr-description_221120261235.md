# PR draft: Dark calculator UI and safe calculation helper

- Base: `main`
- Head: `ghcp-capstone-after-review`
- Proposed commit message:

  ```text
  feat: apply calculator black-orange theme and add tests

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
  ```

## 1. Summary

Refresh the calculator with a responsive dark-and-orange interface and clearer focus and interaction states. Replace expression evaluation with an explicit calculation helper, and test that production helper directly.

## 2. Changes Made

- `src/App.css` — add responsive calculator styling, hover/active states, visible keyboard focus, and reduced-motion support.
- `src/index.css` — define dark/orange design tokens and simplify global layout styles.
- `src/App.jsx` — use the extracted production calculation helper instead of `eval`.
- `src/calculator.js` — implement arithmetic using an explicit operator switch; unsupported operators return `NaN`.
- `test_scripts/calculator.test.ts` — exercise the production helper across six arithmetic and invalid-operator cases.
- `Artifacts/requirements_221120261135.md` — record requirements and acceptance criteria.
- `Artifacts/architecture_221120261141.md` — document the implementation approach and impacted components.
- `Artifacts/design-review_221120261144.md` — record design review decisions and risks.
- `Artifacts/impl-plan_221120261146.md` — document the implementation and verification plan.
- `Artifacts/security-remediation_221120261151.md` — record security remediation.
- `Artifacts/code-review_221120261203.md` — record code review findings and resolution.
- `Artifacts/unit-tests_221120261206.md` — document unit and UI checks.
- `Artifacts/integration-tests_221120261206.md` — document integration checks, including the revised I5 steps.
- `Artifacts/verification_221120261206.md` — record verification results and limitations.
- This PR-description artifact — preserve the proposed PR body and changelog for approval.

### Changelog entry

- Improved the calculator's responsive dark/orange styling and keyboard focus; replaced `eval` with an explicitly tested arithmetic helper.

## 3. Test Evidence

- `npm.cmd run build` — PASS (exit 0; Vite built 18 modules).
- `npm.cmd run lint` — PASS (exit 0; oxlint).
- `node --experimental-strip-types test_scripts/calculator.test.ts` — PASS (exit 0): decimal addition, subtraction, multiplication, division, negative operand, and unsupported operator. Decimal case: `1.5 + 2.5 = 4`.
- Browser UI: 13 checks passed (U1–U7, I1–I4, I6–I7), including keyboard focus, contrast and 320px/1280px layouts. Evidence: `Artifacts/verification_221120261206.md`.
- Revised I5 browser click flow was **blocked**, not passed; see Known Limitations.

## 4. Known Limitations

- The revised I5 UI sequence `1.5 + 2.5` expecting `4` was not executed: Playwright MCP browser tools were unavailable on follow-up. The previous incorrect input `1.5 + 25` displayed `26.5` and failed its original expectation; it does not verify the revised steps. The separate production-helper test passes the corrected arithmetic, not the UI flow.
- Automated accessible-name and hover-state checks beyond available snapshots remain manual; hover/active states did not receive dedicated screenshot comparison.
- No package-level test script or separate TypeScript type-checker is installed; Node's type stripping runs the standalone test without type-checking.
- `.playwright-mcp/` snapshots/logs are local-only and excluded from the planned PR. The verification artifact references these local files, so they will not be available to reviewers from the PR unless separately provided.

## 5. Reviewer Checklist

- [ ] Confirm the PR targets `main` and the proposed scope is correct.
- [ ] Review the dark/orange styling, responsive layout, focus visibility, and reduced-motion behavior.
- [ ] Review the explicit arithmetic helper and removal of `eval`.
- [ ] Review the build, lint, helper test, and 13 passing UI checks.
- [ ] Run or explicitly accept the blocked revised I5 UI flow (`1.5 + 2.5 = 4`) before approval.
- [ ] Check accessible names and hover/active feedback manually as needed.
- [ ] Confirm local-only `.playwright-mcp/` files are excluded and evidence limitations are acceptable.
- [ ] Confirm no unintended dependencies or sensitive data are included.
