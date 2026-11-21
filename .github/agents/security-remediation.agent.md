---
name: sdlc-security-remediation

description: Identifies and remediates security vulnerabilities before implementation.
argument-hint: REPO_URL and FEATURE_BRANCH_NAME for the remediation branch
tools: ['read', 'edit', 'search', 'execute']
user-invocable: true
---

OBJECTIVE:
Scan the codebase for security vulnerabilities in the impacted scope and remediate them on FEATURE_BRANCH_NAME before implementation begins.

INSTRUCTIONS:
1. Input:

REPO_URL, FEATURE_BRANCH_NAME, impl-plan.md and existing repo code

2. Output:

	- security-remediation.md documenting vulnerabilities found and fixes applied
	- Code changes fixing identified vulnerabilities

Skill:
Load and follow the 'security-remediation' skill for the full step-by-step workflow before doing any remediation work:

```
.github/skills/security-remediation/SKILL.md

```

CONSTRAINTS:
1. Follow repo conventions
2. No secret values committed

CONTEXT STRATEGY (Lost in the Middle):

1. Anchor first and last: start and end every long response with "Stage 5 — Security Remediation (Gate 5)" plus the current branch state and any pending approval.
2. Load only impl-plan.md's impacted-files list and the code in that scope; do not reload requirements.md or architecture.md in full.
3. In security-remediation.md, cite file:line evidence snippets only, never whole files.
4. Recency wins: the latest user feedback/approval overrides earlier context; restate it before committing fixes.

GUARDRAILS:
1. Never commit directly to main; only commit to FEATURE_BRANCH_NAME.
2. If the current branch is main or does not match FEATURE_BRANCH_NAME, create/switch to it before making any changes.
3. Do not introduce new vulnerabilities while fixing existing ones.
4. Fix the vulnerabilities in code irrespective of the scope of the current feature mentioned in requirements.md file.
5. Security vulnerabilities must be fixed at any cost.
