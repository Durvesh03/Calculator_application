Copilot Instructions — Generic Agentic SDLC


Pipeline (must follow order):

1. Requirements

2. Architecture

3. Design Review

4. Implementation Planning

5. Security Remediation

6. Implementation

7. Review

8. Verify

9. PR


Staged Question Policy (MANDATORY):

1. At workflow start, ask ONLY for JIRA_STORY_URL.

2. Do not ask for REPO_URL or FEATURE_BRANCH_NAME until just before Security Remediation begins.

3. At that point, ask ONLY for REPO_URL and FEATURE_BRANCH_NAME (no other questions).

4. If Jira content is inaccessible, immediately ask the user to paste story description + acceptance criteria.



Inputs:

1. JIRA_STORY_URL (required; asked at start)

2. REPO_URL (required; asked right before Security Remediation)

3. FEATURE_BRANCH_NAME (required; asked right before Security Remediation)

4. PR_TARGET_BRANCH: main (fixed)



Artifact files (repo root; create only when the stage runs):

1. requirements.md

2. architecture.md

3. design-review.md

4. impl-plan.md

5. security-remediation.md

6. verification.md



Branching rule (MANDATORY):

1. Use FEATURE_BRANCH_NAME exactly as provided by the user.

2. Create/switch to FEATURE_BRANCH_NAME before any code changes.

3. If branch exists, switch to it.

4. Never commit directly to main.

5. The Security Remediation stage is responsible for enforcing this rule first: if the current branch is main or does not match FEATURE_BRANCH_NAME, it must create/switch to FEATURE_BRANCH_NAME before scanning or fixing anything.



Stage Gates (Hooks):

Each gate's PRE/POST checks are also captured as a standalone hook file under .github/hooks/<stage>.hook.md. Agents must read the matching hook file before starting a stage and before advancing to the next one.

Gate 1 — Requirements Complete

1. requirements.md includes: scope, FR/NFR, acceptance criteria

2. open questions resolved or explicitly deferred



Gate 2 — Architecture Ready

1. architecture.md identifies impacted components/files

2. includes approach for styling/structure and a11y considerations for UI work



Gate 3 — Design Reviewed

1. design-review.md includes risks/gaps + decisions

2. architecture.md updated if required



Gate 4 — Plan Approved

1. impl-plan.md is dependency ordered

2. includes verification approach



Gate 5 — Security Remediation Complete

1. FEATURE_BRANCH_NAME checked out (created if it did not exist; never main)

2. security-remediation.md documents vulnerabilities found and fixes applied

3. no unresolved vulnerabilities remain in scope



Gate 6 — Implementation Done

1. changes implemented on FEATURE\_BRANCH\_NAME

2. available scripts (build/test/lint) run if present; otherwise documented



Gate 7 — Review Passed

1. code review checklist completed and any issues addressed



Gate 8 — Verify Passed

1. verification.md includes evidence (commands + outputs and/or manual checklist)



Gate 9 — PR Ready

1. PR targets main

2. PR description includes Summary, Changes, Evidence, Limitations, Reviewer Checklist



Shared skills / expectations:

1. Ask clarifying questions early (Requirements stage)

2. Keep changes minimal and consistent with repo conventions

3. For UI: prefer CSS variables/tokens; implement hover/active/focus; maintain visible keyboard focus; consider contrast

4. Avoid introducing new dependencies unless required

5. No secrets in code or markdown

