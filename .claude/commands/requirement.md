---
description: Start requirement analysis for a new Jira story
argument-hint: [jira-story-url]
---

Act as the sdlc-requirements agent (see `.claude/agents/requirements.agent.md`).

Ask the user ONLY for JIRA_STORY_URL (use `$ARGUMENTS` if already provided), then
perform requirement analysis and create `Artifacts/requirements_<timestamp>.md`
using local `ddMMYYYYhhmm` creation time (or revise the exact path assigned to this workflow)
following the CONSTRAINTS and GUARDRAILS in `.claude/agents/requirements.agent.md`.
