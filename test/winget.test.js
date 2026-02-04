import { describe, it, expect, vi } from 'vitest';
import { getUpdateCandidates } from '../src/lib/winget.js';
import * as system from '../src/lib/system.js';
import * as wguI18n from '../src/lib/wgu_i18n.js';

describe('getUpdateCandidates', () => {
  const KNOWN_LOCALE = 'en';

  it('returns_empty_array_when_no_updates_are_available', () => {
    const noUpdatesOutput = `No applicable upgrade found.`.trim();

    vi.spyOn(wguI18n, 'getWindowsUserLang').mockReturnValue(KNOWN_LOCALE);
    vi.spyOn(system, 'spawnSyncProcess').mockReturnValue(noUpdatesOutput);

    const candidates = getUpdateCandidates(KNOWN_LOCALE);

    expect(candidates).toEqual([]);
  });

  it('returns_array_with_name_id_currentVersion_and_availableVersion_when_updates_are_available', () => {
    const updatesOutput = `
Name                          ID                    Version        Available      Source
-------------------------------------------------------------------------------------------------
Microsoft Visual Studio Code  Microsoft.VSCode      1.85.0         1.86.0         winget
Node.js                       OpenJS.NodeJS         20.10.0        20.11.0        winget
2 upgrades available.

`;

    vi.spyOn(system, 'spawnSyncProcess').mockReturnValue(updatesOutput);

    const candidates = getUpdateCandidates(KNOWN_LOCALE);

    expect(candidates).toEqual([{ name: 'Microsoft Visual Studio Code', id: 'Microsoft.VSCode', currentVersion: '1.85.0', availableVersion: '1.86.0' }, { name: 'Node.js', id: 'OpenJS.NodeJS', currentVersion: '20.10.0', availableVersion: '20.11.0' }]);
  });
});
