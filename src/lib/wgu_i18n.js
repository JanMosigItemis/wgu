import { spawnSyncProcess } from './system.js';

export const WINGET_COLS_TO_I18N_KEY_MAP = Object.freeze({
  NAME: 'name_col',
  ID: 'id_col',
  VERSION: 'version_col',
  AVAILABLE: 'available_col',
  SOURCE: 'source_col',
});

const WINGET_LOCALIZED_COL_NAMES = {
  name_col: { en: 'Name', de: 'Name' },
  id_col: { en: 'ID', de: 'ID' },
  version_col: { en: 'Version', de: 'Version' },
  available_col: { en: 'Available', de: 'Verfügbar' },
  source_col: { en: 'Source', de: 'Quelle' },
};

const SUPPORTED_LOCALES = ['en', 'de'];

/**
 * Validates that the locale is supported.
 * @param {string} locale - The locale code to validate
 * @throws {Error} If the locale is not supported
 */
export function assertLocaleSupported(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    throw new Error(`Locale '${locale}' is not supported`);
  }
}

/**
 * Returns the localized string for the given name and locale.
 * Falls back to 'en' if not found, or returns the key if missing.
 * @param {string} key - The string key
 * @param {string} locale - The locale code (e.g. 'en', 'de')
 * @returns {string}
 */
export function getColName(key, locale) {
  if (WINGET_LOCALIZED_COL_NAMES[key]) {
    return WINGET_LOCALIZED_COL_NAMES[key][locale] || WINGET_LOCALIZED_COL_NAMES[key].en;
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
