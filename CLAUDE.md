Claude Instructions — Generic Agentic SDLC

This file is auto-loaded by Claude Code as project memory. It mirrors the
GitHub Copilot workflow defined in `.github/copilot-instructions.md`, adapted
for Claude Code's subagents (`.claude/agents/`), skills (`.claude/skills/`),
gate-check docs (`.claude/hooks/`), and slash commands (`.claude/commands/`).


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



Human Approval Policy (MANDATORY):

1. Before advancing past ANY stage, the orchestrator must show the user the full content/diff of any file created or updated in that stage, any commit(s) about to be pushed, and/or any PR about to be created/updated.

2. The orchestrator must explicitly ask for approval and WAIT; it must never invoke the next subagent, run `git push`, or create/update a PR without explicit user approval of that stage's output.

3. If the user requests changes, the same subagent is re-invoked with the feedback and the approval step repeats until approved.

4. This human approval gate is required at every stage, in addition to (not instead of) the automated hook gate checks below.



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

Each gate's PRE/POST checks are also captured as a standalone gate-check file under `.claude/hooks/<stage>.hook.md`. These are plain documentation gate-checks (not Claude Code's native tool-event hooks) — agents must read the matching file before starting a stage and before advancing to the next one.

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

1. changes implemented on FEATURE_BRANCH_NAME

2. available scripts (build/test/lint) run if present; otherwise documented



Gate 7 — Review Passed

1. code review checklist completed and any issues addressed



Gate 8 — Verify Passed

1. verification.md includes evidence (commands + outputs and/or manual checklist)



Gate 9 — PR Ready

1. PR targets main

2. PR description includes Summary, Changes, Evidence, Limitations, Reviewer Checklist



Agents (`.claude/agents/`):

1. sdlc-orchestrator — coordinates the full pipeline, delegates to the specialist agents below via the Task tool

2. sdlc-requirements

3. sdlc-architecture

4. sdlc-design-review

5. sdlc-impl-plan

6. sdlc-security-remediation

7. sdlc-implementation

8. sdlc-code-review

9. sdlc-verify

10. sdlc-pr


Skills (`.claude/skills/`):

1. orchestration — step-by-step pipeline workflow used by sdlc-orchestrator

2. security-remediation — vulnerability scan/fix workflow used by sdlc-security-remediation

3. implementation — coding workflow used by sdlc-implementation

4. code-review — review checklist workflow used by sdlc-code-review


Slash commands (`.claude/commands/`):

1. /requirement — kicks off the sdlc-requirements agent directly



Shared skills / expectations:

1. Ask clarifying questions early (Requirements stage)

2. Keep changes minimal and consistent with repo conventions

3. For UI: prefer CSS variables/tokens; implement hover/active/focus; maintain visible keyboard focus; consider contrast

4. Avoid introducing new dependencies unless required

5. No secrets in code or markdown
