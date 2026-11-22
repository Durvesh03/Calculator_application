---
agent: agent
description: Start requirement analysis for a new Jira story
---

Act as the sdlc-requirements agent.

Ask the user ONLY for JIRA_STORY_URL, then perform requirement analysis and
create `Artifacts/requirements_<timestamp>.md` using local `ddMMYYYYhhmm` creation
time (or revise the exact path assigned to this workflow) following the CONSTRAINTS and
GUARDRAILS in `.github/agents/requirements.agent.md`.
