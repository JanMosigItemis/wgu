import * as readline from 'node:readline';
import { moveCursorToStartOfLine, moveCursor, MOVE_UP, CARRIAGE_RETURN } from './console_commons.js';

const EXPLANATORY_LINE_COUNT = 2;

/**
 * Displays an interactive menu for selecting items from a list
 * @param {string[]} items - List of items to display
 * @param {Object} options - Configuration options
 * @param {NodeJS.WriteStream} options.stdout - Output stream
 * @param {NodeJS.ReadStream} options.stdin - Input stream
 * @param {Console} options.console - Console object for logging
 * @returns {Promise<string[]>} Selected items, or empty array if user quits
 */
export async function interactiveSelect(items, { stdout = process.stdout, stdin = process.stdin, console: consoleObj = console } = {}) {
  if (!items || items.length === 0) {
    return [];
  }

  return new Promise((resolve, _reject) => {
    const selectedLines = new Map();
    let activeLine = 0;

    // Display initial menu
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      consoleObj.log(`[x] ${item.id} ${item.currentVersion} -> ${item.availableVersion}`);
      selectedLines.set(i, true);
    }
    consoleObj.log('');
    consoleObj.log("Use Up/Down arrows to navigate, Space to toggle selection, 'y' to confirm, 'q' to quit.");

    // Move cursor up to the first item
    stdout.write(MOVE_UP(items.length + EXPLANATORY_LINE_COUNT));
    moveCursorToStartOfLine(stdout);

    // Set up raw mode for keypress detection
    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }
    readline.emitKeypressEvents(stdin);

    const onKeypress = (str, key) => {
      // Handle Ctrl+C and Ctrl+D
      if (key && key.ctrl && key.name === 'c') {
        cleanup();
        process.exit(1);
      }

      if (key && key.ctrl && key.name === 'd') {
        cleanup();
        resolve([]);
        return;
      }

      // Handle arrow keys
      if (key && key.name === 'up') {
        if (activeLine > 0) {
          moveCursor(activeLine, activeLine - 1, stdout);
          activeLine--;
        }
      } else if (key && key.name === 'down') {
        if (activeLine < items.length - 1) {
          moveCursor(activeLine, activeLine + 1, stdout);
          activeLine++;
        }
      } else if (str === ' ') {
        // Toggle selection
        if (selectedLines.has(activeLine)) {
          selectedLines.delete(activeLine);
          stdout.write(`${CARRIAGE_RETURN}[ ]`);
        } else {
          selectedLines.set(activeLine, true);
          stdout.write(`${CARRIAGE_RETURN}[x]`);
        }
        moveCursorToStartOfLine(stdout);
      } else if (str === 'y' || str === 'Y') {
        // Confirm selection
        cleanup();

        // Move to one line below the end of the list
        moveCursor(activeLine, items.length + EXPLANATORY_LINE_COUNT, stdout);
        stdout.write(CARRIAGE_RETURN);

        // Sort selected line numbers and get corresponding items
        const selectedIndices = Array.from(selectedLines.keys()).sort((a, b) => a - b);
        const selectedItems = selectedIndices.map((idx) => items[idx].id);
        resolve(selectedItems);
      } else if (str === 'q' || str === 'Q' || (key && key.name === 'escape')) {
        // Quit without selection
        cleanup();

        // Move to one line below the end of the list
        moveCursor(activeLine, items.length + EXPLANATORY_LINE_COUNT, stdout);
        stdout.write(CARRIAGE_RETURN);

        resolve([]);
      }
    };

    const cleanup = () => {
      stdin.removeListener('keypress', onKeypress);
      if (stdin.isTTY) {
        stdin.setRawMode(false);
      }
    };

    stdin.on('keypress', onKeypress);
  });
}
