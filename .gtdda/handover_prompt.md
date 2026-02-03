# GREEN PHASE - Implementation Plan

## Implementation Concept
Modify the `onKeypress` handler in `interactiveSelect` (in `src/lib/menu.js`) to treat the 'enter'/'return' key as a confirmation action, same as 'y'.

## Core Development Principles (Green Phase)
- **Use the simplest solution that could possibly work**
- **Make the test pass with minimal code changes**
- **Do not refactor yet**

## Next Steps
- Update `src/lib/menu.js` to check for `key.name === 'return'` or `key.name === 'enter'` in the confirmation condition.
- Mark the test as done in `.gtdda/plan.md`.
