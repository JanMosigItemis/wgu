Last reviewed on 2026-02-02 17:12

# Suggested Fixes

None

# Suggested Refactorings

[x] 1. [src/lib/menu.js#L8](src/lib/menu.js#L8)
The JSDoc for the `items` parameter describes it as `string[]`, but the implementation treats it as an array of objects with `id`, `currentVersion`, and `availableVersion` properties.
_Suggestion_: Update the JSDoc to reflect the actual expected object structure.

[x] 2. [src/lib/menu.js#L15](src/lib/menu.js#L15)
There is an implicit coupling between `options.logger` and `options.stdout`. The code uses `logger` to print the menu lines and `stdout` to manipulate the cursor position relative to those lines. If these two dependencies point to different outputs (e.g., one to a file and one to the terminal), the cursor movements will be incorrect or corrupt the output.
_Suggestion_: Either use `stdout` for all output to ensure consistency, or explicitly document that `logger` and `stdout` must target the same visual output.

[ ] 3. [test/menu.test.js#L34](test/menu.test.js#L34)
The test uses `vi.waitFor` to wrap the `stdinMock.emit` call. `vi.waitFor` is typically used for retrying assertions until they pass, not for executing actions that should happen once. Using it here might verify that `emit` doesn't throw, but it's semantically confusing and could potentially execute the action multiple times if it were to throw.
_Suggestion_: Remove `vi.waitFor` around the emit call. If a delay is needed to simulate user latency, use a simple sleep/delay promise.

[ ] 4. [test/menu.test.js](test/menu.test.js#L44)
The `mockExit` spy is restored at the end of the test block. If any assertion in the test fails, this line will not be reached, leaving `process.exit` mocked for subsequent tests.
_Suggestion_: Move the mock creation and restoration to `beforeEach`/`afterEach` blocks or use a `try...finally` structure to guarantee restoration.
