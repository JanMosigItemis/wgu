# RED PHASE - Test Plan

## Test Concept
We need to implement the functionality where pressing 'n' in the interactive menu causes it to quit without selection, similar to pressing 'q'.

### Test Case: 'n' Key Handling
- **Setup**:
  - Initialize `interactiveSelect` with a list of items.
  - Mock `stdin`, `stdout`, and `console`.
- **Action**:
  - Simulate a keypress of 'n'.
- **Expectation**:
  - The promise returned by `interactiveSelect` should resolve to an empty array `[]`.
  - `program.exit` should not be called (implied).

## Core Development Principles (Red Phase)
- **Write a failing test that defines a small increment of functionality**
- Ensure the test fails because 'n' is currently treated as an unknown key (or ignored).
