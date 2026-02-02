# RED PHASE - Test Plan

## Test Concept
We need a test to verify that `interactiveSelect` handles user interruption gracefully without terminating the process abruptly.

### Test Case: Ctrl+C Handling
- **Setup**:
  - Mock `process.stdin`, `process.stdout`, and `process.exit`.
  - Provide a list of dummy items to `interactiveSelect`.
- **Action**:
  - Start `interactiveSelect`.
  - Simulate a `keypress` event for `Ctrl+C` on `stdin`.
- **Expectation**:
  - `process.exit` should **NOT** be called.
  - The function should resolve (e.g., with `null` or a specific cancellation value) or reject, returning control to the caller.

## Core Development Principles (Red Phase)
- **Write a failing test that defines a small increment of functionality**
- Ensure the test fails because the current implementation calls `process.exit` directly.
