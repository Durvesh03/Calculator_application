---
name: orchestration

description: Coordinates SDLC agent pipeline.
---


STAGE 0 — Intake:

Ask the user ONLY for JIRA_STORY_URL.



Delegate in order:

1. sdlc-requirements

2. sdlc-architecture

3. sdlc-design-review

4. sdlc-impl-plan



STAGE 5 — Collect Security Remediation Inputs (ask only now)

Ask ONLY for:

1. REPO_URL (required)

2. FEATURE_BRANCH_NAME (required)


Then delegate:

5. sdlc-security-remediation
6. sdlc-implementation
7. sdlc-code-review
8. sdlc-verify
9. sdlc-pr (base branch fixed: main)


After each stage:

1. Check the corresponding Gate in copilot-instructions.md

2. Output: Pipeline Status PASS/FAIL, reasons, next action

3. Suggest a commit message


Stop if any gate fails.

