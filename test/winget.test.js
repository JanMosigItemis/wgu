import { describe, it, expect, vi } from 'vitest';
import { getUpdateCandidates, parseWingetOutput } from '../src/lib/winget.js';
import * as system from '../src/lib/system.js';

describe('parseWingetOutput', () => {
  const KNOWN_LOCALE = 'en';

  it('returns_empty_array_when_no_updates_are_available', () => {
    const noUpdatesOutput = `No applicable upgrade found.`.trim();

    const candidates = parseWingetOutput(noUpdatesOutput, KNOWN_LOCALE);

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

    const candidates = parseWingetOutput(updatesOutput, KNOWN_LOCALE);

    expect(candidates).toEqual([{ name: expectedName, id: expectedId, currentVersion: expectedCurrentVer, availableVersion: expectedAvailableVer }]);
  });

  it('filters_out_packages_from_ignore_list', () => {
    const wingetOutput = `
Name                          ID                    Version        Available      Source
-------------------------------------------------------------------------------------------------
Microsoft Visual Studio Code  Microsoft.VSCode      1.85.0         1.86.0         winget
Git                           Git.Git               2.40.0         2.41.0         winget
Node.js                       OpenJS.NodeJS         18.0.0         18.1.0         winget
3 upgrades available.

`;
    const ignoreList = ['Git.Git', 'OpenJS.NodeJS'];

    const candidates = parseWingetOutput(wingetOutput, KNOWN_LOCALE, ignoreList);

    expect(candidates).toEqual([{ name: 'Microsoft Visual Studio Code', id: 'Microsoft.VSCode', currentVersion: '1.85.0', availableVersion: '1.86.0' }]);
  });
});

describe('getUpdateCandidates', () => {
  const KNOWN_LOCALE = 'en';

  it('calls_spawnSyncProcess_with_correct_arguments_and_returns_parsed_output', () => {
    const mockOutput = `
Name                          ID                    Version        Available      Source
-------------------------------------------------------------------------------------------------
Microsoft Visual Studio Code  Microsoft.VSCode      1.85.0         1.86.0         winget
1 upgrade available.

`;
    const ignoreList = ['Some.Package'];

    const spawnSpy = vi.spyOn(system, 'spawnSyncProcess').mockReturnValue(mockOutput);

    const result = getUpdateCandidates(KNOWN_LOCALE, ignoreList);

    expect(spawnSpy).toHaveBeenCalledWith('winget', ['upgrade', '--include-unknown']);
    expect(result).toEqual([{ name: 'Microsoft Visual Studio Code', id: 'Microsoft.VSCode', currentVersion: '1.85.0', availableVersion: '1.86.0' }]);
  });
});
