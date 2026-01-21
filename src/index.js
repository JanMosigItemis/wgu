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
export async function main({ stdout = process.stdout, stderr = process.stderr } = {}) {
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

    console.log(`This is WGU v${WGU_VERSION}`);
    console.log('Detected Windows User language:', getWindowsUserLang());
    console.log('');

    console.log('Retrieving list of updatable packages..');
    const candidates = getUpdateCandidates();

    if (candidates.length === 0) {
      console.log('No packages available to update.');
      return 0;
    }

    const selectedIds = await interactiveSelect(candidates);

    if (selectedIds.length === 0) {
      console.log('Exiting without performing updates.');
      return 0;
    }

    console.log('Ok, running updates..');
    await runUpdates(selectedIds, async (id, err) => {
      console.error(`Failed to update package ${id}: ${err.message}`);
      return askPermissionToContinue();
    });

    return 0;
  } catch (err) {
    stderr.write(`Error: ${err.message}\n`);
    return 1;
  }
}
