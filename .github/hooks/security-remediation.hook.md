---
name: security-remediation-hook
gate: 5
stage: Security Remediation
---

PRE-CHECK (before starting):
1. impl-plan.md exists and Gate 4 passed
2. REPO_URL and FEATURE_BRANCH_NAME provided

POST-CHECK (before moving to Implementation):
1. FEATURE_BRANCH_NAME checked out (created if it did not exist; never main)
2. security-remediation.md documents identified vulnerabilities and fixes applied
3. No unresolved vulnerabilities remain in scope
