# RED PHASE - Test Plan

## Test Concept
Create a test for `interactiveSelect` default selection behavior:
- **Scenario**: `interactiveSelect` is initialized with a list of update items.
- **Action**: No input is simulated immediately, just checking initial state (or simulating an immediate 'y' to accept defaults).
- **Expected Result**: The returned list of selected items should contain **all** the items passed to the function initially.

## Core Development Principles (Red Phase)
- **Write a failing test that defines a small increment of functionality**
