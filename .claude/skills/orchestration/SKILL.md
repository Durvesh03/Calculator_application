---
name: orchestration
description: Coordinates SDLC agent pipeline.
---


STAGE 0 — Intake:

Ask the user ONLY for JIRA_STORY_URL.

ARTIFACT HANDOFFS:

Follow the Artifact naming and handoff policy in `CLAUDE.md`. All generated documents go in `Artifacts/` with local `ddMMYYYYhhmm` creation timestamps.
Retain the exact paths returned by each stage and pass only the required current-workflow paths to later agents, approvals, and hook checks. Revisions reuse those paths. Bare artifact names are logical roles, not root filenames; never infer a workflow by choosing the latest filename.



HUMAN APPROVAL GATE (applies after EVERY stage below, no exceptions):

1. When the subagent finishes, show the user the full content of any file it created/updated (or a diff if the file already existed), any commit(s) about to be pushed, and/or any PR description about to be created/updated.

2. Ask explicitly: "Do you approve these changes to proceed to <next stage>? (yes/no + comments)"

3. STOP and wait. Do not invoke the next subagent, do not run `git push`, and do not create/update the PR until the user replies with explicit approval.

4. If the user asks for changes, re-invoke the SAME subagent with that feedback and repeat from step 1. Loop until approved.

5. Only after explicit approval: run the guardrail checks from CLAUDE.md "Guardrail Enforcement", check the stage's hook file gate, output Pipeline Status (PASS/FAIL + reasons + next action), suggest a commit message, then move to the next stage.



CONTEXT STRATEGY (Lost in the Middle — applies to every stage handoff):

1. Anchor first and last: every Pipeline Status message starts and ends with "Stage N — <name> (Gate N)" plus the pending approval/question.
2. One artifact per handoff: pass each subagent only the artifact(s)/sections its stage requires; never forward the full artifact history.
3. Summarize before carrying forward: when a stage depends on a prior artifact, quote only the needed section (e.g. acceptance criteria), not the file.
4. Diff-first: once an artifact exists, present diffs (not full contents) at approval gates.
5. Recency wins: restate the latest user approval/feedback explicitly before each delegation.



Delegate in order (invoke each via the Task tool using its agent `name`), applying the Human Approval Gate above after each one completes:

1. sdlc-requirements

2. sdlc-architecture

3. sdlc-design-review

4. sdlc-impl-plan



STAGE 5 — Collect Security Remediation Inputs (ask only now)

Ask ONLY for:

1. REPO_URL (required)

2. FEATURE_BRANCH_NAME (required)


Then delegate, applying the Human Approval Gate after each one (for sdlc-security-remediation and sdlc-implementation, this includes showing the code diff and pausing for approval BEFORE any `git push`; for sdlc-pr, this includes showing the full PR description and pausing for approval BEFORE the PR is created/updated):

5. sdlc-security-remediation
6. sdlc-implementation
7. sdlc-code-review
8. sdlc-verify
9. sdlc-pr (base branch fixed: main)


After each stage (once approved):

1. Check the corresponding Gate in CLAUDE.md

2. Output: Pipeline Status PASS/FAIL, reasons, next action

3. Suggest a commit message


Stop if any gate fails. Stop (and wait) if human approval has not yet been explicitly given.
