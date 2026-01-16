import { getUpdateCandidateIds, runUpdates } from './lib/winget.js';
import { interactiveSelect } from './lib/menu.js';

const VERSION = '0.0.1';

/**
 * Main application logic
 * @param {Object} options - Configuration options
 * @param {NodeJS.WriteStream} options.stdout - Output stream
 * @param {NodeJS.WriteStream} options.stderr - Error stream
 * @param {NodeJS.ReadStream} options.stdin - Input stream
 * @returns {Promise<number>} Exit code
 */
export async function main({ stdout = process.stdout, stderr = process.stderr, _stdin = process.stdin } = {}) {
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

    console.log(`This is WGU v${VERSION}`);
    console.log('');

    console.log('Retrieving list of updatable packages..');
    const candidateIds = await getUpdateCandidateIds();

    if (candidateIds.length === 0) {
      console.log('No packages available for update.');
      return 0;
    }

    const selectedIds = await interactiveSelect(candidateIds);

    if (selectedIds.length === 0) {
      console.log('Exiting without performing updates.');
      return 0;
    }

    console.log('Ok, running updates..');
    await runUpdates(selectedIds);

    return 0;
  } catch (err) {
    stderr.write(`Error: ${err.message}\n`);
    return 1;
  }
}
