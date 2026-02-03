import * as readline from 'node:readline';
import { moveCursorToStartOfLine, moveCursor, MOVE_UP, CARRIAGE_RETURN } from './console_commons.js';

const EXPLANATORY_LINE_COUNT = 2;

/**
 * Updates all items with a given selection state
 * @param {Map} selectedLines - Map of selected line indices to update
 * @param {number} totalLineCount - Total number of items
 * @param {boolean} shouldSelect - Whether items should be selected or deselected
 * @param {number} activeLine - Current cursor position
 * @param {NodeJS.WriteStream} stdout - Output stream
 */
function selectAllOrNothing(selectedLines, totalLineCount, shouldSelect, activeLine, stdout) {
  const checkbox = shouldSelect ? '[x]' : '[ ]';

  // Clear the current selections
  selectedLines.clear();

  // Move to the first item once
  moveCursor(activeLine, 0, stdout);

  for (let i = 0; i < totalLineCount; i++) {
    if (shouldSelect) {
      selectedLines.set(i, true);
    }
    stdout.write(`${CARRIAGE_RETURN}${checkbox}`);

    // Move to next line if not the last item
    if (i < totalLineCount - 1) {
      stdout.write('\n');
    }
  }

  // Move back to the active line
  moveCursor(totalLineCount - 1, activeLine, stdout);
}

/**
 * Displays an interactive menu for selecting items from a list
 * @param {Array<{id: string, currentVersion: string, availableVersion: string}>} items - List of items to display
 * @param {Object} options - Configuration options
 * @param {NodeJS.WriteStream} options.stdout - Output stream
 * @param {NodeJS.ReadStream} options.stdin - Input stream
 * @returns {Promise<string[]>} Selected items, or empty array if user quits
 */
export async function interactiveSelect(items, { stdout = process.stdout, stdin = process.stdin } = {}) {
  if (!items || items.length === 0) {
    return [];
  }

  return new Promise((resolve, _reject) => {
    const selectedLines = new Map();
    let activeLine = 0;

    // Display initial menu
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      stdout.write(`[x] ${item.id} ${item.currentVersion} -> ${item.availableVersion}\n`);
      selectedLines.set(i, true);
    }
    stdout.write('\n');
    stdout.write("Use Up/Down arrows to navigate, Space to toggle, 'a' to toggle all, Enter/'y' to confirm, 'n'/'q' to quit.\n");

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
        resolve(null);
        return;
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
      } else if (str === 'a' || str === 'A') {
        const newSelectionState = selectedLines.size !== items.length;
        selectAllOrNothing(selectedLines, items.length, newSelectionState, activeLine, stdout);
        moveCursorToStartOfLine(stdout);
      } else if (str === 'y' || str === 'Y' || (key && (key.name === 'return' || key.name === 'enter'))) {
        // Confirm selection
        cleanup();

        // Move to one line below the end of the list
        moveCursor(activeLine, items.length + EXPLANATORY_LINE_COUNT, stdout);
        stdout.write(CARRIAGE_RETURN);

        // Sort selected line numbers and get corresponding items
        const selectedIndices = Array.from(selectedLines.keys()).sort((a, b) => a - b);
        const selectedItems = selectedIndices.map((idx) => items[idx].id);
        resolve(selectedItems);
      } else if (str === 'q' || str === 'Q' || str === 'n' || str === 'N' || (key && key.name === 'escape')) {
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
