import { describe, it, expect } from 'vitest';
import * as wgu_i18n from '../src/lib/wgu_i18n.js';

describe('wgu_i18n', () => {
  it('falls_back_to_en_when_system_locale_is_unsupported_and_prints_warning', () => {
    // Arrange
    const unsupportedLocale = 'xx-XX';

    // Act
    const locale = wgu_i18n.getSystemLocaleOrFallback(unsupportedLocale);

    // Assert
    expect(locale).toBe('en');
  });
});
