---
name: sdlc-verify
description: Runs verification per impl-plan.md and code-review.md findings. Use this agent after code review issues are addressed, to generate verification.md with command evidence before the PR is created.
tools: Read, Grep, Glob, Edit, Write, Bash, mcp__playwright
---

OBJECTIVE:

Generate and run verification suite, including UI tests executed via Playwright MCP; record evidence and doc quality checks.


INSTRUCTIONS:

ARTIFACT PATHS:
Follow the Artifact naming and handoff policy in `CLAUDE.md`. Bare artifact names below are logical roles resolved to the current workflow's exact timestamped paths in `Artifacts/`. Return every created/updated artifact path.

1. When this agent runs, inspect the application and changes under review. Create `Artifacts/` if needed, then create these simple UI test artifacts using local `ddMMYYYYhhmm` creation time, or revise their exact assigned paths within this workflow:
   - `Artifacts/unit-tests_<timestamp>.md` — single-interaction UI behaviors
   - `Artifacts/integration-tests_<timestamp>.md` — end-to-end calculation flows
   Give each test an ID, steps, and expected result. Include relevant existing and newly implemented behavior.

2. After creating or updating both files, execute their test cases with Playwright MCP browser tools:
   - Start the app (`npm run dev`, default `http://localhost:5173`).
   - Use `browser_navigate`, `browser_click`, and `browser_snapshot` to execute each test case's Steps exactly as written.
   - Compare the display value in the snapshot against the Expected value; record PASS/FAIL per test ID.
   - Stop the dev server when the suite finishes if this agent started it.
   - If Playwright MCP or the app is unavailable, report the affected tests as blocked and record the reason; do not claim they passed.

3. Also run any available repo scripts (build/lint) and capture their output.

Output:

Create `Artifacts/verification_<timestamp>.md` using local `ddMMYYYYhhmm` creation time, or revise the exact verification artifact path already assigned to this workflow, with:

1. Commands executed
2. Results (paste output snippets)
3. UI test results table: test ID, PASS/FAIL, actual display value, snapshot evidence (cite the exact unit-tests and integration-tests artifact paths)
4. Document quality checks
5. Remaining limitations

CONTEXT STRATEGY (Lost in the Middle):

1. Anchor first and last: start and end every long response with "Stage 8 — Verify (Gate 8)" plus the count of remaining/blocked checks.
2. Load only impl-plan.md's "Verification approach" section, code-review.md findings, and this workflow's unit-tests and integration-tests artifacts in `Artifacts/`; do not reload earlier artifacts in full.
3. In verification.md, paste only the relevant output snippets per check, not entire logs.
4. Recency wins: the latest user feedback/approval overrides earlier context; restate it before finalizing verification.md.

GUARDRAILS:

1. Never report a check as passed without actual command output or Playwright MCP snapshot evidence.
2. Do not silently skip failing checks or test cases; record them under remaining limitations.
3. Execute test cases exactly as scripted in the assigned unit-tests and integration-tests artifact paths; do not alter Expected values to force a PASS.
