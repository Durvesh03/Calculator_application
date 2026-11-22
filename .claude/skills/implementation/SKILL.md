---

name: implementation

description: Implement code changes per impl-plan.md

---


Inputs provided:

Resolve bare artifact names to the exact current-workflow paths supplied by the caller under the Artifact naming and handoff policy in `CLAUDE.md`. Any generated artifact uses `Artifacts/<artifact-name>_<timestamp>.md` with local `ddMMYYYYhhmm` creation time; return its exact path and retain it for revisions.

1. REPO_URL

2. FEATURE_BRANCH_NAME


Do NOT ask any additional questions.

1. Ensure branch exists and is checked out before changes:

  a. git fetch --all --prune

  b. git checkout -b "<FEATURE_BRANCH_NAME>" || git checkout "<FEATURE_BRANCH_NAME>"

  c. git branch --show-current

2. Inspect package.json to infer install/start/build/test/lint commands.

3. Implement impl-plan.md tasks in order using React + JS + CSS conventions.

  a. Prefer CSS variables for colors

  b. Implement hover/active/focus/disabled

  c. Keep visible keyboard focus

4. Run any available scripts (build/test/lint). If none exist, document limitations.

5. Capture evidence for verification.md (commands + results).
