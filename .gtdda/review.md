Last reviewed on 2026-02-02T16:48:26+01:00

# Suggested Fixes
None

# Suggested Refactorings
[x] 1. [test/menu.test.js#L52](test/menu.test.js#L52)
The test uses `await new Promise((resolve) => { setTimeout(resolve, 100); });` which is a flaky way to wait for async operations. `vi.waitFor` is already used above and is more reliable.
_Suggestion_: Remove the arbitrary sleep. Since `selectPromise` is awaited right after, the test will naturally wait for `interactiveSelect` to complete. If `interactiveSelect` hasn't resolved after the keypress, `await selectPromise` will hang (or timeout), which is a valid failure mode.

[ ] 2. [test/menu.test.js#L34](test/menu.test.js#L34)
The test data `items` is slightly more verbose than needed for this specific test case (verifying Ctrl+C).
_Suggestion_: While not critical, you could use a simpler single-item array since the list content doesn't impact the cancellation logic.

[ ] 3. [test/menu.test.js#L6](test/menu.test.js#L6)
`process.exit` is being mocked/restored manually in `beforeEach`/`afterEach`. Vitest provides `vi.spyOn(process, 'exit')` which handles restoration automatically if `vi.restoreAllMocks()` is used, or simply `mockExit.mockRestore()` at end of test.
_Suggestion_: Use `vi.spyOn(process, 'exit').mockImplementation(() => {})` for cleaner mocking and automatic restoration capabilities.
