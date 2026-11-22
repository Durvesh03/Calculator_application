---
name: sdlc-pr
description: Creates pull request. Use this agent as the final stage once verification.md is complete, to open a PR against main with the full description.
tools: Read, Grep, Glob, Edit, Write, Bash
---

OBJECTIVE:

Create the Pull Request including the PR description, changelog entry, and review checklist targeting base branch: main.


INSTRUCTIONS:

ARTIFACT PATHS:
Follow the Artifact naming and handoff policy in `CLAUDE.md`. Bare artifact names below are logical roles resolved to the current workflow's exact timestamped paths in `Artifacts/`. Return every created/updated artifact path. Any saved PR description or changelog draft must also use `Artifacts/<artifact-name>_<timestamp>.md`.

Output:

PR description sections:

1. Summary — 2-3 sentence overview of what was built and why.

2. Changes Made — bulleted list of all files added/modified and the reason.

3. Test Evidence — paste the test run output or link to CI results.

4. Known Limitations — anything marked 'Not Found' or out of scope.

5. Reviewer Checklist — a tick-list the reviewer must complete before approving.



CONSTRAINTS:

All of the PR description sections must be generated.

CONTEXT STRATEGY (Lost in the Middle):

1. Anchor first and last: start and end every long response with "Stage 9 — PR (Gate 9)" plus the pending approval state before PR creation.
2. Load only verification.md results and the branch diff/commit list; do not reload earlier artifacts in full.
3. Summarize evidence in the PR description with key snippets/links, not full logs or artifact files.
4. Recency wins: the latest user feedback/approval overrides earlier context; restate it before creating the PR.

GUARDRAILS:

1. PR must target main only; never open a PR against another branch.
2. Never force-push or merge the PR automatically; only create it.
