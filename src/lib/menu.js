import * as readline from 'node:readline';
import { moveCursorToStartOfLine, moveCursor, CARRIAGE_RETURN } from './console_commons.js';

const EXPLANATORY_LINE_COUNT = 2;

function selectAllOrNothing(items, shouldSelect) {
  const selectedLines = new Map();
  for (let i = 0; i < items.length; i++) {
    if (shouldSelect) {
      selectedLines.set(i, true);
    }
  }

  return selectedLines;
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
    let activeLine = 0;

    let selectedLines = selectAllOrNothing(items, true);
    redrawSelection(items, selectedLines, activeLine, stdout);

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
        selectedLines = selectAllOrNothing(items, newSelectionState);
        redrawSelection(items, selectedLines, activeLine, stdout);
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
function redrawSelection(items, selectedLines, activeLine, stdout) {
  moveCursor(activeLine, 0, stdout);
  stdout.write(CARRIAGE_RETURN);
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const checkBox = selectedLines.has(i) ? '[x]' : '[ ]';
    stdout.write(`${checkBox} ${item.name} ${item.currentVersion} -> ${item.availableVersion}\n`);
  }

  stdout.write('\n');
  stdout.write("Use Up/Down arrows to navigate, Space to toggle, 'a' to toggle all, Enter/'y' to confirm, 'n'/'q' to quit.\n");

  moveCursor(items.length + EXPLANATORY_LINE_COUNT, activeLine, stdout);
}

