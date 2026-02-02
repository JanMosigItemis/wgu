import { getUpdateCandidates, runUpdates } from './lib/winget.js';
import { interactiveSelect } from './lib/menu.js';
import WGU_VERSION from './lib/version.js';
import { askPermissionToContinue } from './lib/console_commons.js';
import { assertWindows, assertWingetAvailable } from './lib/os.js';
import { getWindowsUserLang } from './lib/wgu_i18n.js';
/**
 * Main application logic
 * @param {Object} options - Configuration options
 * @param {NodeJS.WriteStream} options.stdout - Output stream
 * @param {NodeJS.WriteStream} options.stderr - Error stream
 * @returns {Promise<number>} Exit code
 */
export async function main({ stdout = process.stdout, stderr = process.stderr, stdin = process.stdin, console: consoleObj = console } = {}) {
  assertWindows();
  assertWingetAvailable();

  try {
    // Set cursor to underline
    stdout.write('\x1b[4 q');

    // Restore default cursor on exit
    const restoreCursor = () => {
      stdout.write('\x1b[6 q');
    };
    process.on('exit', restoreCursor);
    process.on('SIGINT', () => {
      restoreCursor();
      process.exit(0);
    });

    consoleObj.log(`This is WGU v${WGU_VERSION}`);
    consoleObj.log('Detected Windows User language:', getWindowsUserLang());
    consoleObj.log('');

    consoleObj.log('Retrieving list of updatable packages..');
    const candidates = getUpdateCandidates();

    if (candidates.length === 0) {
      consoleObj.log('No packages available to update.');
      return 0;
    }

    const selectedIds = await interactiveSelect(candidates, { stdout, stdin, console: consoleObj });

    if (selectedIds === null) {
      consoleObj.log('Caught signal to exit.');
      return 0;
    } else if (selectedIds.length === 0) {
      consoleObj.log('Nothing left to update. Exiting.');
      return 0;
    } 
    consoleObj.log('Ok, running updates..');
    await runUpdates(selectedIds, async (id, err) => {
      consoleObj.error(`Failed to update package ${id}: ${err.message}`);
      return askPermissionToContinue();
    });
    
  } catch (err) {
    stderr.write(`Error: ${err.message}\n`);
    return 1;
  }

  return 0;
}
