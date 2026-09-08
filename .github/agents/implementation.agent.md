---
name: sdlc-implementation

description: Implements code changes per impl-plan.md.
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

GUARDRAILS:
1. Never commit directly to main; only commit to FEATURE_BRANCH_NAME.
2. Never invent requirements not present in impl-plan.md; ask the user if unclear.



