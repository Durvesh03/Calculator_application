---

name: code-review

description: Perform code review for changed code in current repo.

---


Below is the Review Area vs Review question mapping for code review :

1. Correctness : Does each component behave as specified in requirements.md?

2. Security : Are secrets excluded from output? Is user input validated?

3. Error Handling : Are all API failures, missing files, and empty repos handled gracefully?

4. Test Coverage : Do tests cover the happy path AND the 'Not Found' / missing-field edge cases?

5. Code Clarity : Are function names self-explanatory? Is logic easy to follow without comments?

6. DRY Principle : Is there duplicated logic that Claude can refactor into a shared function?

7. Dependency Safety : Does Claude flag any known-vulnerable package versions?


Resolve bare artifact names to the exact current-workflow paths supplied by the caller under the Artifact naming and handoff policy in `CLAUDE.md`.

Produce a checklist with PASS/FAIL and concrete fixes in `Artifacts/code-review_<timestamp>.md` using local `ddMMYYYYhhmm` creation time; return its exact path and retain it for revisions.

If fixes are needed, specify exact file edits.
