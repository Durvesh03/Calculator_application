# Security Remediation

**Stage:** 5 — Security Remediation
**Feature branch:** `claude-capstone` (confirmed via `git branch --show-current`; branch already matched
`FEATURE_BRANCH_NAME`, so no create/switch was needed)
**Repo:** https://github.com/Durvesh03/Calculator_application.git
**Scope of scan:** Entire tracked source tree (`src/**`, `index.html`, `vite.config.js`, `.oxlintrc.json`,
`package.json`/dependency tree), independent of the color-coding feature's own scope in
`impl-plan.md`/`requirements.md`, per the guardrail that security fixes apply regardless of feature scope.

## Methodology

1. Confirmed current branch equals `FEATURE_BRANCH_NAME` (`claude-capstone`) before any changes — no
   branch switch required.
2. Scanned `src/*.jsx` and `src/*.css` for OWASP Top 10 / CWE patterns:
   - Injection: `eval()`, `new Function()`, `exec`, string-built shell/SQL commands.
   - XSS: `dangerouslySetInnerHTML`, `innerHTML` assignment with untrusted data.
   - Hardcoded secrets/credentials in tracked source files.
   - Insecure/vulnerable dependencies (`npm audit`) and unsafe deserialization patterns.
3. Inspected `index.html`, `vite.config.js`, `.oxlintrc.json` for build/config-level issues.
4. Fixed each confirmed finding with the least invasive change that preserves existing calculator
   behavior.
5. Re-ran `npm run lint` and `npm run build` to confirm no regressions.

## Findings and Fixes

### 1. Code Injection via `eval()` — CWE-95 (Improper Neutralization of Directives in Dynamically
Evaluated Code) / OWASP A03:2021 - Injection

- **File affected:** `src/App.jsx` (function `calculate`, originally line 42).
- **Description:** `calculate(first, second, operator)` built an arithmetic expression as a string
  (`` `${first}${operator}${second}` ``) and executed it with `eval()`. Although the four call sites in
  this component only ever pass an operator drawn from a small internal set (`+ - * /`), `eval()` on a
  string built from any value that could ever include user-influenced input executes arbitrary
  JavaScript in the page's context — a textbook CWE-95 code-injection pattern, and a standing risk if this
  function is ever reused/extended (e.g. to accept keyboard input parsed less strictly, or a differently
  wired operator value). The code even carried a `// Vulnerable: ... CWE-95` comment flagging it.
- **Fix applied:** Replaced the string-building/`eval()` call with an explicit `switch` statement that
  dispatches on the known operator strings (`"+"`, `"-"`, `"*"`, `"/"`) and performs the corresponding
  native arithmetic operation directly. No dynamic code execution remains; the function can no longer
  execute arbitrary strings regardless of what value ever reaches the `operator` parameter.

  ```diff
   const calculate = (first, second, operator) => {
  -    // Vulnerable: builds an expression string and evaluates it (CWE-95 code injection).
  -    return eval(`${first}${operator}${second}`);
  +    // Fixed: explicit operator dispatch instead of building/evaluating a string
  +    // expression (previously eval(`${first}${operator}${second}`) — CWE-95 code
  +    // injection). Numeric semantics (including division-by-zero -> Infinity/NaN)
  +    // are preserved.
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

- **Behavior preserved:** Numeric semantics are identical to the previous `eval`-based arithmetic,
  including JavaScript's division-by-zero behavior (`x / 0` → `Infinity`, `0 / 0` → `NaN`). All four
  operator buttons (`+`, `−`, `×`, `÷`) and the `=` button call the same `calculate` function signature
  unchanged, so no other code needed to change.
- **Verification:**
  - `npm run lint` (`oxlint`) — passes, no new warnings/errors.
  - `npm run build` (`vite build`) — completes successfully, no new errors.
  - Manual numeric spot-check (Node REPL) comparing the new `switch`-based `calculate` against the
    previous `eval` semantics for `2+3`, `5-2`, `4*6`, `10/4`, and `7/0`, confirming identical results
    (`5`, `3`, `24`, `2.5`, `Infinity` respectively).
  - Confirmed via `grep` that no `eval(`, `new Function(`, or other dynamic-code-execution calls remain
    anywhere under `src/`.

## Other Patterns Checked — No Issues Found

- **XSS (`dangerouslySetInnerHTML` / `innerHTML`):** None present anywhere in `src/`. The calculator
  display renders `{display}` as plain React text content (auto-escaped), not raw HTML.
- **Hardcoded secrets/credentials:** None found in tracked source files (`src/App.jsx`, `src/App.css`,
  `src/main.jsx`, `src/index.css`, `index.html`, `vite.config.js`, `.oxlintrc.json`). Note:
  `.env.example` shows as modified and `.mcp.json` as untracked in `git status`, but both are pre-existing
  changes unrelated to this workflow's scope and were left untouched per explicit instruction — they were
  not inspected or altered as part of this remediation.
- **Insecure/vulnerable dependencies:** `npm audit` reports 0 vulnerabilities (0 info/low/moderate/
  high/critical) across all 67 production + dev + optional dependencies.
- **Unsafe deserialization:** No `JSON.parse` of untrusted/remote input, no `localStorage`/`sessionStorage`
  reads deserialized into executable structures, and no server-side deserialization surface exists in this
  client-only calculator app.
- **Build/config files (`index.html`, `vite.config.js`):** Standard Vite/React template content; no
  inline scripts, no injected untrusted values, no unsafe plugin configuration.

## Regression Check

- `npm run lint` → pass (no errors/warnings).
- `npm run build` → pass (`vite build` completed, `dist/` output produced, bundle sizes unchanged in
  kind — no new modules/dependencies introduced).
- Calculator functional behavior (addition, subtraction, multiplication, division, division-by-zero,
  clear, decimal entry) is unchanged, since only the internal implementation of `calculate()` changed;
  its inputs/outputs and all call sites (`inputOperator`, `handleEquals`) are untouched.

## Files Changed

- `src/App.jsx` — replaced `eval()`-based `calculate()` with explicit operator `switch` dispatch (CWE-95
  fix). No other lines changed; no `className`/JSX structural changes made (those remain in scope for the
  Implementation stage per `impl-plan.md`).

## Outstanding Items

None. No unresolved vulnerabilities remain in scope. The only vulnerability identified in the codebase
(`eval()` in `src/App.jsx`) has been fixed and verified. This remediation was performed ahead of and
independent of the color-coding feature implementation, per the guardrail that security fixes are not
limited by the current feature's scope.
