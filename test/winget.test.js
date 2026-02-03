import { describe, it, expect, vi } from 'vitest';
import { getUpdateCandidates } from '../src/lib/winget.js';
import * as system from '../src/lib/system.js';
import * as wguI18n from '../src/lib/wgu_i18n.js';

describe('getUpdateCandidates', () => {
  it('returns_empty_array_when_no_updates_are_available', () => {
    const noUpdatesOutput = `
No applicable upgrade found.
    `.trim();

    vi.spyOn(wguI18n, 'getWindowsUserLang').mockReturnValue('en');
    vi.spyOn(system, 'spawnSyncProcess').mockReturnValue(noUpdatesOutput);

    const candidates = getUpdateCandidates();

    expect(candidates).toEqual([]);
  });

  it('throws_user_friendly_error_when_locale_is_unsupported', () => {
    vi.spyOn(wguI18n, 'getWindowsUserLang').mockReturnValue('fr');

    expect(() => getUpdateCandidates()).toThrow("Locale 'fr' is not supported");
  });
});
