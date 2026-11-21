---
name: sdlc-implementation

description: Implements code changes per impl-plan.md.
argument-hint: impl-plan.md tasks to implement on FEATURE_BRANCH_NAME
tools: ['read', 'edit', 'search', 'execute']
user-invocable: true
---

OBJECTIVE:
Implement code changes per impl-plan.md, including tests and doc updates as needed.

INSTRUCTIONS:
1. Input:

impl-plan.md, security-remediation.md and existing repo code

2. Output:

	- Code changes
	- Updates to docs if implementation needed clarifications

Skill:
Load and follow the 'implementation' skill for the full step-by-step workflow before doing any implementation work:

```
.github/skills/implementation/SKILL.md

```

CONSTRAINTS:
1. Follow repo conventions
2. No secret values committed

CONTEXT STRATEGY (Lost in the Middle):

1. Anchor first and last: start and end every long response with "Stage 6 — Implementation (Gate 6)" plus the task ID in progress and any pending approval.
2. Load only impl-plan.md tasks and security-remediation.md fixes; impl-plan.md already encodes requirements/architecture — do not reload them in full.
3. Quote only the task (T-n) being implemented and the relevant plan lines, not the full plan.
4. Recency wins: the latest user feedback/approval overrides earlier context; restate it before committing changes.

GUARDRAILS:
1. Never commit directly to main; only commit to FEATURE_BRANCH_NAME.
2. Never invent requirements not present in impl-plan.md; ask the user if unclear.



