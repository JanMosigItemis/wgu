Last reviewed on 2026-02-03 10:48

# Suggested Fixes
None

# Suggested Refactorings
[x] 1. [src/lib/menu.js#L30]
The help text is missing instructions for available keys 'a' (toggle all) and 'n' (quit).
_Suggestion_: Update the help text string to accurately reflect all available interactive actions.

[x] 2. [src/lib/menu.js#L78]
The loop logic for toggling all items (select/deselect) is duplicated.
_Suggestion_: Extract the common logic for iterating over items and updating the cursor/selection state into a helper function or simplify the loop to handle both state transitions.

[x] 3. [src/lib/menu.js#L4]
`EXPLANATORY_LINE_COUNT` is manually coupled to the number of lines printed before the list.
_Suggestion_: Instead of a hardcoded constant, consider capturing the cursor position or calculating the number of lines dynamically to ensure robust alignment if the header changes.

[x] 4. [src/lib/menu.js#L93]
The cursor movement strategy inside the 'a' loop (moving back and forth between `activeLine` and `i` for every item) is inefficient (O(N) operations) and may cause visual flickering on slower terminals or large lists.
_Suggestion_: Since we are updating the entire list, it might be more efficient to move the cursor to the top of the list once, rewrite the entire list state, and then move back to the `activeLine`.
