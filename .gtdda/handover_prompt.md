# GREEN PHASE - Implementation Plan

## Implementation Concept
Modify `interactiveSelect` in `src/lib/menu.js` to handle the `Ctrl+C` interrupt by returning `null` (or a specific sentinel value) instead of calling `process.exit(1)`. This will allow the caller (the main loop) to handle the cleanup or exit gracefully.

## Core Development Principles (Green Phase)
- **Use the simplest solution that could possibly work**
- **Make the test pass with minimal code changes**
- **Do not refactor yet**

## Next Steps
- Change `onKeypress` logic in `src/lib/menu.js`.
- Mark the test as done in `.gtdda/plan.md` after verification.
