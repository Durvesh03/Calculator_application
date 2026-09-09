# Security Remediation — SCRUM-6: Color-code Calculator Buttons by Category

**Source:** [requirements.md](requirements.md), [architecture.md](architecture.md), [design-review.md](design-review.md), [impl-plan.md](impl-plan.md)

## Branch Confirmation

- Required branch: `ghcp-capstone-security`
- `git branch --show-current` → `ghcp-capstone-security` (confirmed before any scanning/changes).
- Branch was already checked out per prior terminal history; verified independently as required by the gate. No commits have been made to `main`.

## Scope of Scan

Per [impl-plan.md](impl-plan.md), this story's planned changes are confined to:
- [src/App.jsx](src/App.jsx) — add static `className` values to existing buttons.
- [src/App.css](src/App.css) — add CSS custom properties and color rules.

The scan below covers these in-scope files plus a whole-repo pass for OWASP Top 10 / CWE patterns (injection, XSS, hardcoded secrets, insecure dependencies), consistent with the skill's dual mandate (in-scope remediation + awareness of pre-existing issues).

## Findings

### 1. Pre-existing / Out-of-Scope: `eval()`-based arithmetic — CWE-95 (Code Injection)

- **File:** [src/App.jsx](src/App.jsx) — `calculate()` function:
  ```js
  return eval(`${first}${operator}${second}`);
  ```
- **Description:** Builds a JavaScript expression string from `first`, `operator`, `second` and evaluates it with `eval()`. `operator` values are currently constrained to hardcoded button handlers (`"/"`, `"*"`, `"-"`, `"+"`), so there is no current user-controlled injection path via the UI. However, `eval()` is inherently unsafe (CWE-95 / OWASP A03:2021-Injection) and is explicitly called out as a known vulnerability in the code comment.
- **Status:** **Explicitly OUT OF SCOPE** per [requirements.md](requirements.md) ("Fixing the existing `eval()`-based calculation vulnerability (tracked separately, not part of this story)"). **Not fixed** in this stage — documented here as an accepted, tracked risk for a future story.

### 2. In-Scope Check: Planned CSS/class-name changes — no new vulnerabilities

- **Files:** [src/App.jsx](src/App.jsx), [src/App.css](src/App.css)
- **Verification against current source:**
  - Every `className` in the current [src/App.jsx](src/App.jsx) (`"clear"`, `"equals"`, `"zero"`) is a static string literal, never derived from props, state, or any external/user-controlled input. The [impl-plan.md](impl-plan.md) changes only add more static literals (`"number"`, `"operator"`, `"number zero"`) — no dynamic/template-based class construction is introduced.
  - No `dangerouslySetInnerHTML`, `innerHTML`, or other raw-DOM/HTML-injection sinks exist anywhere in [src/App.jsx](src/App.jsx) or [src/main.jsx](src/main.jsx).
  - The planned [src/App.css](src/App.css) additions are static CSS custom properties (`--color-*` hex values) and selector rules — no `url()`, `expression()`, `@import` of remote/untrusted sources, or attribute-based CSS injection vectors.
  - Conclusion: the planned styling/class-name-only changes **do not introduce CSS injection, XSS, or any other new vulnerability class**. Claim in [impl-plan.md](impl-plan.md) verified against actual source.
- **Status:** No fix required — no in-scope vulnerability found.

### 3. Repo-wide checks (informational)

- **Hardcoded secrets/credentials:** None found in [src/App.jsx](src/App.jsx), [src/App.css](src/App.css), [src/main.jsx](src/main.jsx), [src/index.css](src/index.css), [index.html](index.html), or [package.json](package.json).
- **Insecure dependencies:** `npm audit --omit=dev` → **0 vulnerabilities** found in production dependencies (`react`, `react-dom`).
- **Insecure deserialization / SQL / shell injection:** Not applicable — no server-side code, database access, or shell execution exists in this front-end-only codebase.

## Fixes Applied

None. No in-scope vulnerabilities were identified in the files/changes covered by this story ([src/App.jsx](src/App.jsx), [src/App.css](src/App.css)). The one known vulnerability in the codebase (`eval()` in `calculate()`) is explicitly out of scope per [requirements.md](requirements.md) and is left unchanged, documented above as an accepted risk.

## Verification

- `git branch --show-current` → `ghcp-capstone-security` (correct feature branch, not `main`).
- `npm audit --omit=dev` → 0 vulnerabilities.
- `npm run lint` (oxlint) → passed, no errors.
- Manual source review of [src/App.jsx](src/App.jsx) confirms all `className` values are static string literals; no dynamic class/HTML construction exists or is planned.

## Outcome

**No unresolved in-scope vulnerabilities remain.** The codebase is ready for implementation of the SCRUM-6 styling changes on `ghcp-capstone-security`. The pre-existing `eval()` risk remains tracked and accepted as out-of-scope for this story.
