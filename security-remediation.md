# Security Remediation

**Branch:** `ghcp-capstone-with-security-fixes`
**Scope:** Files impacted by [impl-plan.md](impl-plan.md) (SCRUM-6 calculator button color coding) — [src/App.jsx](src/App.jsx), [src/App.css](src/App.css), [src/main.jsx](src/main.jsx), [src/index.css](src/index.css), [index.html](index.html), [package.json](package.json).

## Vulnerabilities Found & Fixed

### 1. Code Injection via `eval()` — CWE-95 / OWASP A03:2021 (Injection)

- **Severity:** High
- **File:** [src/App.jsx](src/App.jsx)
- **Description:** The `calculate()` function built an arithmetic expression string from user-controlled display input and operator, then executed it with `eval()`:
  ```js
  return eval(`${first}${operator}${second}`);
  ```
  Although the current UI only feeds numeric button presses into `display`, `eval()` executes arbitrary JavaScript for any string it's given. Any future change that allows raw keyboard/text input, paste, or programmatic state manipulation (e.g., via dev tools, browser extensions, or a future "type an expression" feature) would allow arbitrary code execution in the user's browser session — a classic code-injection vector.
- **Fix Applied:** Replaced the `eval()`-based expression evaluation with an explicit `switch` on the four supported operators (`+`, `-`, `*`, `/`), each performing plain numeric arithmetic with no string execution:
  ```js
  const calculate = (first, second, operator) => {
    switch (operator) {
      case "+": return first + second;
      case "-": return first - second;
      case "*": return first * second;
      case "/": return first / second;
      default: return second;
    }
  };
  ```
  Behavior is unchanged (including division-by-zero returning `Infinity`, matching the prior `eval` behavior), and no UI/styling was touched.
- **Verification:** `npm run lint` passes with no errors/warnings. Manual trace of `inputOperator`/`handleEquals` call sites confirms `calculate()` is only invoked with numeric `first`/`second` and one of the four known operator strings, so the new `switch` covers all call paths.

## Other Checks Performed (No Issues Found)

| Check | Result |
|---|---|
| XSS (`dangerouslySetInnerHTML`, `innerHTML`, `document.write`) | None found in `src/` |
| `new Function()` / `exec()` / shell/SQL string building | None found |
| Hardcoded secrets/credentials in source or config | None found. A `.env` file with a live JIRA API token exists locally but is **not tracked by git** (confirmed via `git ls-files .env` and `git log --all -- .env`, both empty) and is excluded via [.gitignore](.gitignore). [.env.example](.env.example) contains only empty placeholder keys. No action required in this scope, but rotating the token is recommended as good hygiene since it sits in plaintext on disk. |
| Dependency vulnerabilities (`npm audit`) | 0 vulnerabilities in production dependencies; 0 vulnerabilities in full dependency tree (React 19.2.8, Vite 8.2.2, oxlint 1.79.0) |
| Insecure deserialization | Not applicable — no serialization/deserialization of untrusted data in this codebase |

## Confirmation

No unresolved vulnerabilities remain in scope. The single identified issue (`eval()` code injection in `src/App.jsx`) has been remediated with a safe, behavior-preserving arithmetic implementation. Lint and dependency audit both pass clean.
