import { spawnSyncProcess } from './system.js';

export const WINGET_COLS = Object.freeze({
  NAME: 'name_col',
  ID: 'id_col',
  VERSION: 'version_col',
  AVAILABLE: 'available_col',
  SOURCE: 'source_col',
});

// Winget table column names
const col_names = {
  name_col: { en: 'Name', de: 'Name' },
  id_col: { en: 'ID', de: 'ID' },
  version_col: { en: 'Version', de: 'Version' },
  available_col: { en: 'Available', de: 'Verfügbar' },
  source_col: { en: 'Source', de: 'Quelle' },
};

/**
 * Returns the localized string for the given name and locale.
 * Falls back to 'en' if not found, or returns the key if missing.
 * @param {string} key - The string key
 * @param {string} locale - The locale code (e.g. 'en', 'de')
 * @returns {string}
 */
export function getColName(key, locale) {
  if (col_names[key]) {
    return col_names[key][locale] || col_names[key].en;
  }
  throw new Error(`Missing localization for key: ${key}`);
}

export function getWindowsUserLang() {
  let windowsUserLangTag = 'en-US';
  try {
    windowsUserLangTag = spawnSyncProcess('powershell', ['-c', '(Get-WinUserLanguageList)[0].LanguageTag'])?.trim();
  } catch (err) {
    console.debug(`Could not determine Windows user language, defaulting to ${windowsUserLangTag}:`, err.message);
  }

  return new Intl.Locale(windowsUserLangTag).language;
}
