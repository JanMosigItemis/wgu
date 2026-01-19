import { spawnSync } from 'node:child_process';

export function assertWindows() {
  if (process.platform !== 'win32') {
    throw new Error('This application can only be run on Windows.');
  }
}

/**
 * Throws an error if winget is not available in PATH.
 * @throws {Error} If winget is not found or not executable.
 */
export function assertWingetAvailable() {
  const result = spawnSync('winget', ['--version'], { encoding: 'utf8' });
  if (result.error || result.status !== 0) {
    throw new Error('winget is not available. Please install winget and ensure it is in your PATH.');
  }
}
