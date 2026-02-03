# Test Plan

## Test Scenarios
[x] When interactiveSelect receives Ctrl+C keypress then it returns a cancellation signal
[x] When user presses 'n' then interactiveSelect quits.
[x] When interactiveSelect is called with a list of packages then all provided packages are selected by default.
[x] When user hits 'enter' then selected updates are returned by interactiveSelect.
[x] When all items are selected and user hits 'a' then all items are deselected.
[ ] When some items are selected and user hits 'a' then all items are selected.
[ ] When no items are selected and user hits 'a' then all items are selected.