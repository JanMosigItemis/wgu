# GREEN PHASE - Implementation Plan

## Implementation Concept
Update 'a' key handler in `interactiveSelect` (in `src/lib/menu.js`) to handle the case where some items are selected.

## Implementation Plan
    1. Fix the cursor movement logic in `src/lib/menu.js` inside the 'a' handler.
       - Ensure cursor returns to `activeLine` after each write.
       - Do this for both "select all" and "deselect all" loops.
    
    This adheres to "simplest solution" and fixing known bugs.

    I will also disable the file watcher or timeout if necessary, but 1.5s should be enough.

## Core Development Principles (Green Phase)
- **Use the simplest solution that could possibly work**
- **Make the test pass with minimal code changes**
- **Do not refactor yet**

## Next Steps
- Apply fixes in `src/lib/menu.js`.
- Mark the test as done in `.gtdda/plan.md`.
