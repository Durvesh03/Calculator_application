# Stage 5 — Security Remediation (Gate 5)

1. **Scope and branch:** `src/App.css`, `src/index.css`, and `src/App.jsx`; `ghcp-capstone-after-review`. Plan: `Artifacts/impl-plan_221120261146.md`.
2. **Finding — dynamic code evaluation (OWASP Top 10 2021 A03 Injection; CWE-95):** Before the fix, `src/App.jsx:42` evaluated an expression constructed from calculator state: `eval(...)`. The current UI supplies fixed operators and parsed numbers, so direct attacker control was not established; nevertheless, evaluating constructed code is an unsafe sink and can also fail on valid negative operands.
3. **Fix:** `src/App.jsx:40-52` selects the four arithmetic operations explicitly and returns `NaN` for an unsupported operator. The only JSX change is the calculation helper; handlers and controls remain intact. This conditional file change is justified by the plan's explicit security handoff and the current Stage 5 direction.
4. **Other scoped checks:** Reviewed the three scoped files for injection, HTML insertion, embedded credentials, unsafe deserialization, and dependency use. No other such issue was identified in those files. Dependency advisory status was not independently audited: manifests and installed dependency internals are outside the requested code-inspection scope.
5. **Verification:**
   - In-memory Node harness extracted the actual component handlers: seven arithmetic cases, chaining, operator replacement, decimal, clear, negative operands, and rejected operators passed.
   - `npm.cmd run lint` passed; `npm.cmd run build` passed. No test script is defined in `package.json`.
   - `npm run lint` and `npm run build` initially failed because PowerShell blocks `npm.ps1`; using `npm.cmd` succeeded without changing execution policy.
   - Scoped pattern search after the fix found only the existing React and CSS imports; no targeted unsafe sinks or embedded credentials were found. `git diff --check` passed; package and lockfile diffs were empty.
6. **Limitations and gate:** This is a scoped review, not a whole-repository or dependency-advisory audit. No identified scoped vulnerability remains unresolved. Human approval is pending; no commit, push, or implementation was performed.
