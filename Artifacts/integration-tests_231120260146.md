# Integration Tests — End-to-End Calculation Flows (Branch: claude-capstone-with-artifacts)

Scope: `src/App.jsx`, `src/calculate.js`. Covers multi-step calculation flows (AC-6/AC-7),
divide-by-zero / error-state handling (Security Remediation + commit `6817f6c`), and chained
calculation after error reset. Does not cover single-interaction/visual-only behaviors — see
`Artifacts/unit-tests_231120260146.md` for those.

Each test ID, Steps, and Expected Result below is executed verbatim via Playwright MCP against
`http://localhost:5173` (Vite dev server, `npm run dev`).

---

## IT-1 — Basic addition: 2 + 3 = 5 (AC-7, no regression)
**Steps:**
1. Navigate to `http://localhost:5173` (fresh load).
2. Click "2".
3. Click "+".
4. Click "3".
5. Click "=".
6. Take a snapshot.

**Expected Result:** The `.display` element shows `5`.

---

## IT-2 — Divide by zero: 5 ÷ 0 = "Error"
**Steps:**
1. Navigate to `http://localhost:5173` (fresh load).
2. Click "5".
3. Click "÷".
4. Click "0".
5. Click "=".
6. Take a snapshot.

**Expected Result:** The `.display` element shows `Error` (not `Infinity`).

---

## IT-3 — Zero divided by zero: 0 ÷ 0 = "Error"
**Steps:**
1. Navigate to `http://localhost:5173` (fresh load).
2. Click "0".
3. Click "÷".
4. Click "0".
5. Click "=".
6. Take a snapshot.

**Expected Result:** The `.display` element shows `Error` (not `NaN`).

---

## IT-4 — Chained calculation recovers after an Error reset via Clear
**Steps:**
1. Navigate to `http://localhost:5173` (fresh load).
2. Click "5".
3. Click "÷".
4. Click "0".
5. Click "=" (display should show `Error`).
6. Click "C" (clear).
7. Click "2".
8. Click "+".
9. Click "2".
10. Click "=".
11. Take a snapshot.

**Expected Result:** The `.display` element shows `4` — confirming the Error state does not
permanently corrupt subsequent calculations once cleared.

---

## IT-5 — Chained operator calculation without pressing "=" mid-sequence
**Steps:**
1. Navigate to `http://localhost:5173` (fresh load).
2. Click "6".
3. Click "−".
4. Click "2".
5. Click "×" (chains the pending subtraction result into a new operation per `inputOperator`).
6. Click "3".
7. Click "=".
8. Take a snapshot.

**Expected Result:** The `.display` element shows `12` (6 − 2 = 4, then 4 × 3 = 12).

---

## IT-6 — Decimal input flows through a full calculation
**Steps:**
1. Navigate to `http://localhost:5173` (fresh load).
2. Click "1".
3. Click ".".
4. Click "5".
5. Click "+".
6. Click "2".
7. Click "." .
8. Click "5".
9. Click "=".
10. Take a snapshot.

**Expected Result:** The `.display` element shows `4` (1.5 + 2.5 = 4).

---

## IT-7 — Clear button resets mid-calculation state (not just display)
**Steps:**
1. Navigate to `http://localhost:5173` (fresh load).
2. Click "9".
3. Click "+".
4. Click "C".
5. Click "4".
6. Click "=".
7. Take a snapshot.

**Expected Result:** The `.display` element shows `4` — confirming "C" clears the pending
operator/first-number state (not only the visible display text), so pressing "=" afterward with
no operator queued is a no-op that leaves the freshly entered `4` unchanged.

---

**Artifact:** `Artifacts/integration-tests_231120260146.md`
