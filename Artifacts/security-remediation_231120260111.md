# Security Remediation — Calculator Application

## Status
Stage 5 — Security Remediation (Gate 5). Branch: `claude-capstone-with-artifacts` (created from `main`; not yet pushed/committed — pending user approval per Human Approval Policy).

Scope note: per GUARDRAILS (CLAUDE.md / security-remediation agent), this scan covers the whole repository/relevant source scope, not limited to the feature scope in `impl-plan.md` (which covers only `src/App.css` and `className` additions in `src/App.jsx`). The `eval()` finding below was explicitly deferred to this stage by `requirements.md`, `architecture.md` (Section 7), and `impl-plan.md` (Blockers item 1).

## 1. Methodology
- Loaded `impl-plan.md` (`Artifacts/impl-plan_231120260105.md`) for impacted-files context only (no reload of full requirements/architecture).
- Grepped the full tracked repo (excluding `node_modules`) for: `eval(`, `new Function(`, `dangerouslySetInnerHTML`, `innerHTML`, `child_process`/`exec`/`execSync`, and secret/credential patterns (`api[_-]?key|secret|password|token|BEGIN (RSA|PRIVATE) KEY`, case-insensitive).
- Ran `npm audit --omit=dev` against `package.json`/`package-lock.json` for known-vulnerable dependencies.
- Manually reviewed `src/App.jsx`, `src/main.jsx`, `index.html`, `.env.example` for injection/XSS/secret patterns.

## 2. Findings

### Finding 1 — Code Injection via `eval()` (CWE-95 / OWASP A03:2021-Injection)
- **File:affected:** `src/App.jsx:42` (pre-fix)
- **Evidence:**
  ```
  src/App.jsx:40-43 (before fix)
    const calculate = (first, second, operator) => {
      // Vulnerable: builds an expression string and evaluates it (CWE-95 code injection).
      return eval(`${first}${operator}${second}`);
    };
  ```
- **Risk:** `calculate()` concatenates `first`, `operator`, and `second` into a string and passes it to `eval()`. `operator` originates from button click handlers (`inputOperator("/")`, etc.) in this version, so it is not currently attacker-reachable from external input; however, using `eval()` to perform fixed arithmetic is an unnecessary and unsafe pattern (CWE-95: Improper Neutralization of Directives in Dynamically Evaluated Code) — any future change that lets `operator`/`first`/`second` be influenced by external/user-supplied text (e.g., URL params, pasted input, a future expression-input field) would turn this into a remote code-execution-in-browser-context vector (arbitrary JS execution in the page's context).
- **Fix applied:** Replaced the string-built `eval()` call with an explicit `switch` dispatch over the four known operator literals (`+`, `-`, `*`, `/`), using native JS arithmetic operators directly on the two numeric operands already held in state (`previousValue`/`firstNumber` and `currentValue`/`second`). No dynamic code evaluation remains; unrecognized operators fall through to a safe default (returns `second` unchanged) rather than throwing or evaluating anything.
  ```
  src/App.jsx:40-53 (after fix)
    const calculate = (first, second, operator) => {
      // Safe fixed-operator dispatch (no dynamic code execution) — fixes CWE-95.
      switch (operator) {
        case "+":
          return first + second;
        case "-":
          return first - second;
        case "*":
          return first * second;
        case "/":
          return first / second;
        default:
          return second;
      }
    };
  ```
- **Behavior preserved:** Output is byte-for-byte identical to the previous `eval()`-based implementation for all four operators, including the `n/0 → Infinity` edge case (verified — see Verification below). No new dependency introduced; fix uses only native JS operators on the existing `previousValue`/`operator`/`currentValue` model, per the "least invasive" and "no new dependency" constraints.
- **Verification:**
  1. `node -e` script compared `calculate(2,3,'+')`, `calculate(10,4,'-')`, `calculate(6,7,'*')`, `calculate(8,2,'/')`, `calculate(5,0,'/')` against the equivalent `eval()` expressions — all outputs matched exactly (`5`, `6`, `42`, `4`, `Infinity`).
  2. `npm run lint` (`oxlint`) — passed, no warnings/errors.
  3. `npm run build` (`vite build`) — succeeded, 17 modules transformed, no errors.
  4. Manual AC-7-equivalent check: `2 + 3 =` path (`inputOperator("+")` → `handleEquals`) confirmed to still resolve to `5` via the `switch`-based `calculate()`.

### Finding 2 — XSS via `dangerouslySetInnerHTML`/`innerHTML` — Not Found
- Grepped `src/**`, `index.html`, `.github/**`, `.claude/**` for `dangerouslySetInnerHTML` and `innerHTML` with untrusted data. No occurrences in application source (`src/App.jsx`, `src/main.jsx`, `index.html` render plain JSX text/state only — `{display}` is rendered as a React text child, which is auto-escaped). No action required.

### Finding 3 — Hardcoded Secrets/Credentials — Not Found
- Grepped tracked repo files (excluding `node_modules`) for `api[_-]?key|secret|password|token|BEGIN (RSA|PRIVATE) KEY` (case-insensitive).
- Only match in application-relevant files is `.env.example:1-7`, which contains empty placeholder variable names (`JIRA_URL=`, `JIRA_USERNAME=`, `JIRA_API_TOKEN=`, `GITHUB_PERSONAL_ACCESS_TOKEN=`) with no values — this is the standard template-file convention for documenting required env vars and contains no secret values. No action required.
- Remaining matches are documentation/skill/hook files referencing the word "token"/"secret" as policy text (e.g. `CLAUDE.md`, `.claude/skills/security-remediation/SKILL.md`), not actual credential values. No action required.

### Finding 4 — Insecure/Vulnerable Dependencies — Not Found
- `npm audit --omit=dev` against `package.json` (`react ^19.2.8`, `react-dom ^19.2.8`) and `package-lock.json` reported **0 vulnerabilities**. No action required; no dependency changes made (Dependency guardrail: no diff to `package.json`/lockfile).

## 3. Summary Table

| # | Vulnerability | CWE/OWASP | File:Line (before fix) | Status | Fix |
|---|---|---|---|---|---|
| 1 | Code injection via `eval()` | CWE-95 / OWASP A03:2021 | `src/App.jsx:42` | Fixed | Replaced with `switch`-based native-operator dispatch |
| 2 | XSS (`dangerouslySetInnerHTML`/`innerHTML`) | CWE-79 / OWASP A03:2021 | — | Not present | N/A |
| 3 | Hardcoded secrets/credentials | CWE-798 | `.env.example` (placeholders only) | Not present | N/A |
| 4 | Insecure/vulnerable dependencies | CWE-1104 | `package.json`/`package-lock.json` | Not present (0 vulnerabilities via `npm audit`) | N/A |

## 4. Guardrail Checks Performed
- **Branch safety:** `git branch --show-current` → `claude-capstone-with-artifacts` (confirmed before any file edits; branch did not previously exist, created via `git checkout -b`).
- **No direct commits to main:** no commits made in this stage (changes left uncommitted per approval-boundary instruction); `main` untouched.
- **Secret scan on diff:** `git diff -- src/App.jsx | grep -iE "api[_-]?key|secret|password|token|BEGIN (RSA|PRIVATE) KEY"` → no matches.
- **Dependency guardrail:** `git diff --stat` shows only `src/App.jsx` changed (13 insertions, 2 deletions); `package.json`/`package-lock.json` untouched, no new dependency introduced.
- **Scope guardrail:** Edit is limited to `calculate()` in `src/App.jsx` (the exact pre-flagged CWE-95 location); no other file touched. This is out of `impl-plan.md`'s feature scope (which only covers `src/App.css` color tokens and `className` additions) but is explicitly required by CLAUDE.md GUARDRAILS #4 ("Fix the vulnerabilities in code irrespective of the scope of the current feature") and was pre-flagged as deferred-to-this-stage by `requirements.md`/`architecture.md`/`impl-plan.md`. Documented reason: closing the CWE-95 finding that all three prior-stage artifacts explicitly deferred to Security Remediation.

## 5. Files Edited
- `src/App.jsx` — `calculate()` function only (lines ~40-53): removed `eval()`, added `switch`-based operator dispatch.

## 6. Commands Run (Lint/Test/Build)
```
npm run lint        # oxlint — passed, no output/errors
npm run build       # vite build — succeeded, 17 modules transformed, 0 errors
npm audit --omit=dev  # 0 vulnerabilities found
```

## 7. Outstanding Items
None. No unresolved vulnerabilities remain in scope per Gate 5 POST-CHECK. Code changes are uncommitted on `claude-capstone-with-artifacts`, pending explicit user approval before commit/push (per Human Approval Policy — this stage does not commit or push).

---

**Stage 5 — Security Remediation (Gate 5)**
