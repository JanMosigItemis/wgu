import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export const CARRIAGE_RETURN = '\r';
export const MOVE_RIGHT = '\x1b[1C';
export const MOVE_UP = (lines) => `\x1b[${lines}A`;
export const MOVE_DOWN = (lines) => `\x1b[${lines}B`;

/**
 * Move cursor to start of line (after checkbox position)
 */
export function moveCursorToStartOfLine() {
  process.stdout.write(CARRIAGE_RETURN);
  process.stdout.write(MOVE_RIGHT);
}

/**
 * Move the cursor to the specified index (0-based)
 * @param {number} current - Current index
 * @param {number} target - Target index
 */
export function moveCursor(current, target) {
  if (target < current) {
    process.stdout.write(MOVE_UP(current - target));
  } else if (target > current) {
    process.stdout.write(MOVE_DOWN(target - current));
  }
  moveCursorToStartOfLine();
}

export async function askPermissionToContinue() {
  const rl = createInterface({ input, output });

  const answer = await rl.question('Do you want to continue? (y/n): ');
  const userChoice = answer.toLowerCase() === 'y';

  rl.close();

  return userChoice;
}
