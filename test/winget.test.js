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
    const expectedName = 'Microsoft Visual Studio Code';
    const expectedId = 'Microsoft.VSCode';
    const expectedCurrentVer = '1.85.0';
    const expectedAvailableVer = '1.86.0';
    const updatesOutput = `
Name                          ID                    Version        Available      Source
-------------------------------------------------------------------------------------------------
${expectedName}  ${expectedId}      ${expectedCurrentVer}         ${expectedAvailableVer}         winget
1 upgrade available.

`;

    vi.spyOn(system, 'spawnSyncProcess').mockReturnValue(updatesOutput);

    const candidates = getUpdateCandidates(KNOWN_LOCALE);

    expect(candidates).toEqual([{ name: expectedName, id: expectedId, currentVersion: expectedCurrentVer, availableVersion: expectedAvailableVer }]);
  });
});
