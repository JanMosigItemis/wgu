# RED PHASE - Test Plan

## Test Concept
Create a test for the "toggle all" functionality using the 'a' key (Selection Case):
- **Scenario**: `interactiveSelect` is initialized with items.
- **Setup**: Start with a state where only *some* items are selected (e.g., deselected one item manually or started with mixed selection if possible, but currently we select all by default, so we need to deselect one first).
- **Action**: User presses 'a', then confirms validation (Enter/y).
- **Expected Result**: All items should be selected.

## Core Development Principles (Red Phase)
- **Write a failing test that defines a small increment of functionality**
