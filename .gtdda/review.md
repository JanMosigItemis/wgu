Last reviewed on 2026-02-03 10:15

# Suggested Fixes
None

# Suggested Refactorings
[x] 1. [src/lib/menu.js#L30]
Description: The help text instructions are hardcoded and not accurate anymore (missing 'Enter' key).
_Suggestion_: Update the help text to include 'Enter' as a confirmation option.

[ ] 2. [src/lib/menu.js#L77]
Description: Logic for confirming selection is getting complex with multiple conditions (str check vs key check).
_Suggestion_: Move the loop logic into a separate `handleKey(str, key)` function that returns an action-object (e.g. `{ action: 'confirm', value: ... }` or `{ action: 'move', delta: 1 }`). This would make the `onKeypress` handler cleaner and easier to test.

[ ] 3. [src/lib/menu.js#L90]
Description: Quit logic conditions are very long.
_Suggestion_: Similar to above, move the key mapping logic to a helper function.
