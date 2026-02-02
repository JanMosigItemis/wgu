Last reviewed on 2026-02-02T12:39:18+01:00

# Suggested Fixes
None

# Suggested Refactorings
[ ] 1. [package.json#L37](package.json#L37)
The `npm` engine requirement `>=11.5.1` is quite high and might not be met by standard Node.js LTS installations (e.g. Node 18/20) without a manual npm upgrade.
_Suggestion_: Verify if features from npm 11.5.1 are strictly required, or relax the constraint to support standard LTS environments.

[ ] 2. [package.json#L24](package.json#L24)
The `version:gen` script must be run manually to sync `src/lib/version.js` with the version in `package.json`.
_Suggestion_: Automate this by adding it to `version` or `prepack` lifecycle scripts (e.g. adding `"postversion": "npm run version:gen"`) to ensure the code always reflects the package version.
