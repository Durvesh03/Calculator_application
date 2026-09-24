---
name: requirements-hook
gate: 1
stage: Requirements
---

PRE-CHECK (before starting):
1. JIRA_STORY_URL provided by user

POST-CHECK (before moving to Architecture):
1. requirements.md includes: scope, FR/NFR, acceptance criteria
2. Open questions resolved or explicitly deferred
3. User has explicitly reviewed and approved requirements.md (Human Approval Policy, CLAUDE.md)
