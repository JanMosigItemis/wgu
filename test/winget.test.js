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
});
