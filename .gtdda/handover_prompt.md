# RED PHASE - Test Plan

## New Test Case: Toggle 'a' (None -> All)

We need to verify that if the user has deselected everything, pressing 'a' selects everything again.

### Test Concept
1. Initialize interactiveSelect with a list of items.
2. Send input 'a' to deselect all items (since they start selected).
3. Send input 'a' again to select all items.
4. Send input 'ENTER' to confirm.
5. Assert that the returned list contains all the original items.

## Core Development Principles (Red Phase)
- **Write a failing test that defines a small increment of functionality**