---
name: implementation-hook
gate: 6
stage: Implementation
---

PRE-CHECK (before starting):
1. security-remediation.md exists and Gate 5 passed
2. REPO_URL and FEATURE_BRANCH_NAME provided
3. FEATURE_BRANCH_NAME checked out (never main)

POST-CHECK (before moving to Review):
1. Changes implemented on FEATURE_BRANCH_NAME
2. Available build/test/lint scripts run if present; otherwise documented as skipped
3. User has explicitly reviewed and approved the implementation code diff BEFORE any `git push`
