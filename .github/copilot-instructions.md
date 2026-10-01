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



Human Approval Policy (MANDATORY):

1. Before advancing past ANY stage, show the user the full content/diff of any file created or updated in that stage, any commit(s) about to be pushed, and/or any PR about to be created/updated.

2. Explicitly ask for approval (e.g. "Do you approve these changes to proceed?") and WAIT; never invoke the next stage, run `git push`, or create/update a PR without explicit user approval of that stage's output.

3. If the user requests changes, redo that same stage with the feedback and repeat the approval step until approved.

4. This human approval gate applies at every stage, in addition to (not instead of) the automated hook gate checks below. Never treat silence, an unrelated reply, or an automated gate PASS as approval.



Guardrail Enforcement (MANDATORY):

1. Guardrails must be verified with explicit commands/checks, not left to agent judgement alone:

   - Branch safety: `git branch --show-current` must equal FEATURE_BRANCH_NAME and never `main`, checked before any file/code edit and before every commit.
   - No direct commits to main: `git log origin/main..HEAD` must be empty before any push targets `main`.
   - Secret scan: search diffs for `api[_-]?key|secret|password|token|BEGIN (RSA|PRIVATE) KEY` (case-insensitive) before every commit, in Security Remediation, Implementation, and PR.
   - Dependency guardrail: diff `package.json`/lockfiles; any new dependency requires explicit user approval in that stage's approval step.
   - Scope guardrail: each stage only edits files listed as "impacted" in architecture.md/impl-plan.md; out-of-scope edits require a documented reason in the stage artifact.

2. A guardrail FAIL blocks the stage gate exactly like a hook POST-CHECK failure.



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

Each gate's PRE/POST checks are also captured as a standalone hook file under .github/hooks/<stage>.hook.md. Agents must read the matching hook file before starting a stage and before advancing to the next one. Every hook's POST-CHECK implicitly also requires the applicable guardrail checks above passed.

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



Custom Instructions:

1. Scoped `.instructions.md` files live under `.github/instructions/` and apply automatically via their `applyTo` glob (e.g. React components, stylesheets, root SDLC artifact files).

2. Scoped instructions refine but never override this file for files outside their glob — see Skills vs Instructions below for precedence when guidance conflicts.



Skills vs Instructions — Precedence & Conflict Resolution:

When skills, hooks, agents, and instructions conflict, resolve in this order (highest wins):

1. Explicit user instruction in the current turn — always wins.

2. Stage hook file (`.github/hooks/*.hook.md`) — gate-specific PRE/POST checks.

3. Agent definition (`.github/agents/*.agent.md`) — stage role and objective.

4. Skill file (`SKILL.md` under `.github/skills/<name>/`) — reusable "how to do the work" procedure a stage loads.

5. This file (`copilot-instructions.md`) — global defaults.

6. Scoped `.instructions.md` files (`applyTo` glob-scoped) — apply only within their glob; they refine, but never override, the global defaults above for files outside their scope.

Activation rules: hooks and agents are always active for their stage; skills are only active when the owning agent loads them; scoped instructions activate automatically for matching files based on `applyTo`. If a skill and a hook disagree, the hook (gate correctness) wins — skills describe technique, hooks define the pass/fail bar.



Context Strategy ("Lost in the Middle"):

1. Anchor first and last: restate the current stage name, gate number, and pending question at both the start and end of any long agent response.

2. One artifact at a time: load only the artifact file(s) relevant to the current stage (per the gate's PRE-CHECK), not the whole artifact history.

3. Summarize before carrying forward: when a stage depends on a prior artifact, quote only the specific section needed (e.g. acceptance criteria), not the entire file.

4. Recency for decisions: the most recent user approval/feedback always takes precedence over earlier context — restate the latest decision explicitly rather than relying on it being "somewhere above".



Prompt Caching Policy:

1. Treat this file and the current stage's hook + agent file as the stable "prefix" context — keep their content and order unchanged within a run so runtimes that support prompt/context caching can reuse it.

2. Do not interleave frequently-changing content (live command output, diffs) before the stable prefix; append it after, so cache hits aren't invalidated by churn at the front.

3. Avoid re-pasting whole artifact files turn over turn — reference the file path and only quote the delta.



Memory Types:

| Memory type | Scope | Where it lives | What goes in it |
|---|---|---|---|
| User memory | Cross-workspace, persistent | `/memories/` (root) | Durable preferences (e.g. preferred commit style) |
| Session memory | Current conversation only | `/memories/session/` | In-progress stage notes, pending approvals |
| Repository memory | This repo, persistent | `/memories/repo/` | Verified build/test/lint commands, repo conventions |
| Task/project memory | This pipeline run | Root artifact files (`requirements.md` ... `verification.md`) | The SDLC state itself — source of truth for stage handoffs |

Rule: before starting a stage, check repository memory first for known conventions; only ask the user if nothing is recorded. Update repository memory when a new convention is verified during a stage.



Token Optimization Strategy:

1. Staged questions (already enforced): only ask for inputs needed by the current stage.

2. Concise artifacts: artifact files use numbered lists/tables, not prose duplication of prior artifacts.

3. Context pruning: when loading a prior artifact for a later stage, extract only the section required instead of the full file.

4. Diff-first: when showing changes for approval, show diffs rather than full file contents once a file already exists.

5. Budget guardrail: if a single stage's context (artifacts + hook + agent + skill) would require quoting more than ~2 full artifact files, summarize the older one instead of quoting it in full.



Prompt Engineering Standards:

1. Decomposition: one stage = one file = one responsibility (agent defines role, hook defines gate, skill defines procedure).

2. Explicit constraints over implicit ones: guardrails and gates are written as checkable statements ("X exists", "Y equals Z"), not vague guidance.

3. Staged/progressive disclosure: ask only for what's needed now (Staged Question Policy).

4. Acceptance criteria as contracts: every stage's POST-CHECK is the acceptance criteria for that stage's output — treat it as a pass/fail contract, not a suggestion.

5. Few-shot via artifacts: later stages read earlier artifacts as grounding context instead of re-deriving requirements from scratch.

6. Fail closed: on ambiguity, stop and ask rather than assuming — never silently invent REPO_URL, branch names, or scope.

