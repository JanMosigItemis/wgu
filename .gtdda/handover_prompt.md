# GREEN PHASE - Implementation Plan

## Implementation Concept
Implement 'a' key handler in `interactiveSelect` (in `src/lib/menu.js`) to deselect all checkboxes.
- **Logic**:
  - Check if all items are currently selected.
  - If yes, clear all selections.
  - Update `selectedLines` state map.
  - Redraw all checkboxes:
    - Iterate from `0` to `items.length - 1`.
    - Use `moveCursor` to jump to each line.
    - Print `[ ]`.
    - Return cursor to original `activeLine`.

## Core Development Principles (Green Phase)
- **Use the simplest solution that could possibly work**
- **Make the test pass with minimal code changes**
- **Do not refactor yet**

## Next Steps
- Implement logic in `src/lib/menu.js`.
- Mark the test as done in `.gtdda/plan.md`.
