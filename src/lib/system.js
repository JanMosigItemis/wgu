import { spawnSync } from 'node:child_process';

/**
 * Spawns a synchronous child process to run a command with the given arguments.
 *
 * @param {string} cmd - The command to run.
 * @param {string[]} args - The list of string arguments.
 * @param {boolean} [inheritStdio=false] - Whether to inherit stdio from the parent process.
 * @returns {string} The standard output from the command.
 * @throws {Error} If the process fails to start or exits with a non-zero status code.
 */
export function spawnSyncProcess(cmd, args, inheritStdio = false) {
  const stdio = inheritStdio ? 'inherit' : 'pipe';
  const child = spawnSync(cmd, args, { shell: false, stdio, encoding: 'utf8' });

  const stdout = child.stdout || '';
  const stderr = child.stderr || '';

  if (child.error) {
    throw new Error(`Cmd failed with: ${child.error.message}`);
  }

  if (child.status !== 0) {
    throw new Error(`Cmd exited with code ${child.status}${stderr ? `: ${stderr}` : ''}`);
  }

  return stdout;
}
