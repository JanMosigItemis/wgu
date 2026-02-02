# GREEN PHASE - Implementation Plan

## Implementation Concept
Modify `interactiveSelect` in `src/lib/menu.js` to listen for the keypress 'n'. When 'n' is pressed, it should treat it the same way as 'q' or 'ESC' - by quitting and returning an empty array `[]`.

## Core Development Principles (Green Phase)
- **Use the simplest solution that could possibly work**
- **Make the test pass with minimal code changes**
- **Do not refactor yet**

## Next Steps
- Implement 'n' handler in `onKeypress` logic in `src/lib/menu.js`.
- Mark the test as done in `.gtdda/plan.md`.
