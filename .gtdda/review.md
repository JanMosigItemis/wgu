Last reviewed on 2026-02-02T12:44:59+01:00

# Suggested Fixes

[ ] 2. [src/lib/menu.js#L43](src/lib/menu.js#L43)
`interactiveSelect` calls `process.exit(1)` directly upon receiving `Ctrl+C`. This abruptly terminates the process from within a library function, preventing the main application loop from handling the exit gracefully (e.g., running cleanup tasks defined in `src/index.js`).
_Suggestion_: Instead of exiting, return a sentinel value to signal cancellation to the caller.

# Suggested Refactorings

[ ] 1. [package.json](package.json)
The project lacks automated tests.
_Suggestion_: Introduce a testing framework (e.g., the built-in `node:test` runner) and add unit tests, particularly for the output parsing logic in `winget.js`.

[ ] 2. [src/lib/console_commons.js](src/lib/console_commons.js)
ANSI escape codes are hardcoded as exported constants.
_Suggestion_: While acceptable for a small tool, consider moving all cursor manipulation logic into a dedicated class or using a small library if complexity grows, to improve readability and encapsulation.
