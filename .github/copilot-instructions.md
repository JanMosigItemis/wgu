# Copilot instructions for this repository (JavaScript CLI)

## Ground rules

- If your context does not contain ground rules, you **MUST ALWAYS** read in the file .gtdda/gtdda_general_ground_rules.md and **ALWAYS** follow the ground rules depicted therein.

## Target Environment

- Build a **command-line application** intended to run on **Windows**.
- Use **Node.js LTS** on Windows.
- Use **ESM** (`"type": "module"`). Do not introduce CommonJS (`require`, `module.exports`).
- Prefer Node built-ins over dependencies (e.g., `node:fs`, `node:path`, `node:child_process`, `node:readline`, `node:os`).

### Windows + CMD conventions (preferred shell)

- Assume **CMD.EXE** as the primary shell environment for documentation and examples.
- When providing usage examples, use **CMD syntax** (e.g., `%VAR%` for env vars), not PowerShell syntax (e.g., `$env:VAR`).
- When spawning subprocesses:
  - Prefer `spawn(command, args, { shell: false })`.
  - Do **not** rely on PowerShell features or cmdlets.
  - If a shell is explicitly required, use `cmd.exe /d /s /c` and document why; avoid `powershell.exe`.
- Avoid instructions that require PowerShell (execution policy changes, PS-only piping idioms, etc.).
- CLI interface expectations:
  - Provide `--help` and a non-zero exit code on invalid usage.
  - Use `stdout` for normal output and `stderr` for errors/warnings.
  - Return meaningful exit codes (`0` success, `1` general failure, `2` usage/config errors).
  - prefer flags and stdin piping over interactive prompts
- Performance/safety:
  - Stream large files instead of loading them fully into memory.
  - Treat all input (args, env vars, stdin, files) as untrusted; validate and sanitize.

## Coding Standards

- Use modern JavaScript (ES2022+ features available in Node LTS).
- Prefer `const` / `let`; never use `var`.
- Prefer small, pure functions; avoid hidden side effects.
- Handle errors explicitly:
  - Use `try/catch` around I/O boundaries.
  - Provide actionable error messages (what failed + how to fix).
  - Do not swallow exceptions; either handle or rethrow with context.
- Keep dependencies minimal; justify new deps in the PR/commit message.
- Security:
  - Do not use `eval` or construct shell commands from untrusted input.
  - When using `child_process`, prefer `spawn` with args array over `exec`.
- Formatting:
  - Keep code consistently formatted (assume Prettier if present).
  - Use early returns to reduce nesting.
  - Prefer strict equality `===` / `!==`.

## Structural Preferences

- Organize code so the CLI entrypoint is thin and delegates to library functions.
- Suggested layout (adjust to the repo’s existing structure):
  - `src/cli.js` — argument parsing, help text, exit codes
  - `src/index.js` — main orchestration (calls into modules)
  - `src/lib/*.js` — core logic (testable, no direct process I/O)
  - `src/utils/*.js` — small shared helpers (logging, validation, fs helpers)
- Keep all side effects (file system, process exit) near the edges (CLI layer).
- Provide a single `main(args, { stdin, stdout, stderr })`-style entry for testability when feasible.
- Avoid deep inheritance; prefer composition and plain objects.

## Documentation & Commenting

- Prefer self-explanatory code and clear naming over heavy commenting.
- Add comments only when they explain **why** (tradeoffs, constraints), not **what**.
- Use JSDoc for public functions/modules and for non-obvious parameter/return shapes:
  - Document parameters, return types, thrown errors, and side effects.
- CLI help text must be accurate and updated with every flag/behavior change.
- All examples in docs/help must use **CMD** conventions.
- Keep logs and errors user-focused:
  - include actionable next steps
  - avoid dumping stack traces unless in a `--debug` mode (if present)
