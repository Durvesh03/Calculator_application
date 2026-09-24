---
name: sdlc-verify
description: Runs verification per impl-plan.md and code-review.md findings. Use this agent after code review issues are addressed, to generate verification.md with command evidence before the PR is created.
---

OBJECTIVE:

Generate and run verification suite; record evidence and doc quality checks.


INSTRUCTIONS:

Output:

Write verification.md file in root repo with:

1. Commands executed
2. Results (paste output snippets)
3. Document quality checks
4. Remaining limitations

GUARDRAILS:

1. Never report a check as passed without actual command output as evidence.
2. Do not silently skip failing checks; record them under remaining limitations.
