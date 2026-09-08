---

name: security-remediation

description: Identify and remediate security vulnerabilities before implementation

---

Inputs provided:

1. REPO_URL

2. FEATURE_BRANCH_NAME

Do NOT ask any additional questions.

1. Ensure correct branch before any changes:

  a. git fetch --all --prune

  b. git branch --show-current

  c. If the current branch is "main" or does not equal FEATURE_BRANCH_NAME:

    git checkout -b "<FEATURE_BRANCH_NAME>" || git checkout "<FEATURE_BRANCH_NAME>"

  d. Confirm: git branch --show-current

2. Scan the files impacted by impl-plan.md scope for common vulnerability patterns (OWASP Top 10 / CWE), including:

  a. Injection: eval(), Function(), exec, string-built SQL/shell commands

  b. XSS: dangerouslySetInnerHTML, innerHTML with untrusted data

  c. Hardcoded secrets/credentials

  d. Insecure dependencies or unsafe deserialization

3. Fix each identified vulnerability with the least invasive secure alternative, preserving existing behavior.

4. Document findings in security-remediation.md:

  - Vulnerability description (with OWASP/CWE reference)
  - File(s) affected
  - Fix applied
  - Verification (how it was confirmed fixed)

5. Run any available lint/test scripts to confirm no regressions.
