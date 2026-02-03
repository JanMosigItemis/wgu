import { getColName, getWindowsUserLang, assertLocaleSupported, WINGET_COLS_TO_I18N_KEY_MAP } from './wgu_i18n.js';
import { spawnSyncProcess } from './system.js';

/**
 * Retrieves a list of package IDs that can be updated via winget
 * @returns {string[]} Array of package IDs
 * @throws {Error} If winget command fails or returns empty output
 */
export function getUpdateCandidates() {
  const locale = getWindowsUserLang();
  assertLocaleSupported(locale);
  const NAME_COL_NAME = getColName(WINGET_COLS_TO_I18N_KEY_MAP.NAME, locale);
  const ID_COL_NAME = getColName(WINGET_COLS_TO_I18N_KEY_MAP.ID, locale);
  const VERSION_COL_NAME = getColName(WINGET_COLS_TO_I18N_KEY_MAP.VERSION, locale);
  const AVAILABLE_COL_NAME = getColName(WINGET_COLS_TO_I18N_KEY_MAP.AVAILABLE, locale);
  const SOURCE_COL_NAME = getColName(WINGET_COLS_TO_I18N_KEY_MAP.SOURCE, locale);
  const tableHeaderRegex = new RegExp(`.*${NAME_COL_NAME}\\s+${ID_COL_NAME}\\s+${VERSION_COL_NAME}\\s+${AVAILABLE_COL_NAME}\\s+${SOURCE_COL_NAME}.*`);

  const wgOutput = spawnSyncProcess('winget', ['upgrade', '--include-unknown']);
  if (!wgOutput || wgOutput.trim().length === 0) {
    throw new Error('winget update command failed or returned empty output');
  }

  // Remove last 2 lines (summary info + newline)
  const lines = wgOutput
    .split('\n')
    .slice(0, -2)
    .map((line) => line.trim());

  const outputLineCount = lines.length;
  const tableHeaderIndex = lines.findIndex((line) => line.match(tableHeaderRegex) !== null);
  if (tableHeaderIndex === -1) {
    return [];
  }
  const headerLine = lines[tableHeaderIndex].trim();
  const posOffset = headerLine.indexOf(NAME_COL_NAME);
  const idPos = headerLine.indexOf(ID_COL_NAME) - posOffset;
  const versionPos = headerLine.indexOf(VERSION_COL_NAME) - posOffset;
  const availablePos = headerLine.indexOf(AVAILABLE_COL_NAME) - posOffset;
  const sourcePos = headerLine.indexOf(SOURCE_COL_NAME) - posOffset;
  if (posOffset === -1 || idPos === -1 || versionPos === -1 || availablePos === -1 || sourcePos === -1) {
    throw new Error('Could not find expected column headers in winget output');
  }

  const idColLength = versionPos - idPos;
  const versionColLength = availablePos - versionPos;
  const availableColLength = sourcePos - availablePos;

  const packageListStartLineIndex = tableHeaderIndex + 2; // Skip header and separator line
  const candidates = [];

  for (let i = packageListStartLineIndex; i < outputLineCount; i++) {
    const line = lines[i];
    if (!line || line.trim().length === 0) {
      continue;
    }
    const id = line.substring(idPos, idPos + idColLength).trim();
    const currentVersion = line.substring(versionPos, versionPos + versionColLength).trim();
    const availableVersion = line.substring(availablePos, availablePos + availableColLength).trim();
    if (id) {
      candidates.push({ id, currentVersion, availableVersion });
    }
  }

  return candidates;
}

/**
 * Runs winget update commands for the provided package IDs
 * @param {string[]} ids - Package IDs to update
 * @returns {Promise<void>}
 */
export async function runUpdates(ids, errorHandler = async (_id, _err) => false) {
  for (const id of ids) {
    console.log(`Updating package: ${id}`);
    // prettier-ignore
    try {
      spawnSyncProcess('winget', [
        'upgrade',
        '-i',
        '--id',
        id,
        '--accept-source-agreements',
        '--accept-package-agreements'
      ], true);
      console.log(`Package ${id} updated successfully.`);
    } catch (err) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await errorHandler(id, err))) {
        throw err;
      }
    }
  }
}
