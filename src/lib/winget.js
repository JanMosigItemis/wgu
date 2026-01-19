import { spawnSync } from 'node:child_process';

/**
 * Retrieves a list of package IDs that can be updated via winget
 * @returns {string[]} Array of package IDs
 * @throws {Error} If winget command fails or returns empty output
 */
export function getUpdateCandidateIds() {
  const NAME_COL = 'Name';
  const ID_COL = 'ID';
  const VERSION_COL = 'Version';
  const tableHeaderRegex = new RegExp(`.*${NAME_COL}\\s+${ID_COL}\\s+${VERSION_COL}.*`);

  // Get winget upgrade list
  const wgOutput = execWinget(['upgrade', '--include-unknown']);

  if (!wgOutput || wgOutput.trim().length === 0) {
    throw new Error('winget update command failed or returned empty output');
  }

  // Remove last line (summary info)
  const lines = wgOutput
    .split('\n')
    .slice(0, -1)
    .map((line) => line.trim());

  const outputLineCount = lines.length;
  const tableHeaderIndex = lines.findIndex((line) => line.match(tableHeaderRegex) !== null);
  if (tableHeaderIndex === -1) {
    throw new Error('Could not find table header in winget output');
  }
  // Find column positions
  const namePos = lines[tableHeaderIndex].indexOf(NAME_COL);
  const idPos = lines[tableHeaderIndex].indexOf(ID_COL);
  const versionPos = lines[tableHeaderIndex].indexOf(VERSION_COL);
  if (namePos === -1 || idPos === -1 || versionPos === -1) {
    throw new Error('Could not find expected column headers in winget output');
  }

  // Calculate column positions relative to start of each line
  const packageIdStartPos = idPos - namePos;
  const packageIdColLength = versionPos - idPos;

  const packageListStartLineIndex = tableHeaderIndex + 2; // Skip header and separator line
  const packageIds = [];

  // Extract package IDs from each line
  for (let i = packageListStartLineIndex; i < outputLineCount - 1; i++) {
    const line = lines[i];
    if (!line || line.trim().length === 0) {
      continue;
    }

    const packageId = line.substring(packageIdStartPos, packageIdStartPos + packageIdColLength).trim();

    if (packageId) {
      packageIds.push(packageId);
    }
  }

  return packageIds;
}

/**
 * Runs winget update commands for the provided package IDs
 * @param {string[]} ids - Package IDs to update
 * @returns {Promise<void>}
 */
export async function runUpdates(ids) {
  for (const id of ids) {
    console.log(`Updating package: ${id}`);
    // prettier-ignore
    try {
      execWinget([
        'upgrade',
        '-i',
        '--id',
        id,
        '--accept-source-agreements',
        '--accept-package-agreements'
      ], { inheritStdio: true });
      console.log(`Package ${id} updated successfully.`);
    } catch (err) {
      console.error(`Failed to update package ${id}: ${err.message}`);
    }
  }
}

/**
 * Synchronously executes winget command and returns stdout
 * @param {string[]} args - Command arguments
 * @param {Object} options - Execution options
 * @param {boolean} options.inheritStdio - Whether to inherit stdio
 * @returns {string} Command stdout
 * @throws {Error} If command fails
 */
function execWinget(args, { inheritStdio = false } = {}) {
  const stdio = inheritStdio ? 'inherit' : 'pipe';
  const child = spawnSync('winget', args, { shell: false, stdio, encoding: 'utf8' });

  const stdout = child.stdout || '';
  const stderr = child.stderr || '';

  if (child.error) {
    throw new Error(`Failed to execute winget: ${child.error.message}`);
  }

  if (child.status !== 0) {
    throw new Error(`winget exited with code ${child.status}${stderr ? `: ${stderr}` : ''}`);
  }

  return stdout;
}
