---
name: security-remediation-hook
gate: 5
stage: Security Remediation
---

PRE-CHECK (before starting):
1. impl-plan.md exists and Gate 4 passed
2. REPO_URL and FEATURE_BRANCH_NAME provided

POST-CHECK (before moving to Implementation):
1. FEATURE_BRANCH_NAME checked out (created if it did not exist; never main) — verified via `git branch --show-current`
2. security-remediation.md documents identified vulnerabilities and fixes applied
3. No unresolved vulnerabilities remain in scope
4. User has explicitly reviewed and approved security-remediation.md and the code diff BEFORE any `git push`
5. Secret scan run against the diff (pattern in CLAUDE.md "Guardrail Enforcement") with no findings, or findings remediated
6. Dependency guardrail run: any new/changed dependency in package.json/lockfiles is called out and approved
