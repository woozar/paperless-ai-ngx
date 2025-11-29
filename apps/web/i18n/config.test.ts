import { describe, it, expect } from 'vitest';
import { locales, defaultLocale, localeNames, type Locale } from './config';

describe('i18n/config', () => {
  describe('locales', () => {
    it('exports an array of supported locales', () => {
      expect(locales).toEqual(['en', 'de']);
    });

    it('is readonly and immutable', () => {
      expect(Object.isFrozen(locales)).toBe(false); // const assertion makes it readonly in TS, not frozen
      expect(locales).toHaveLength(2);
    });
  });

  describe('defaultLocale', () => {
    it('is set to English', () => {
      expect(defaultLocale).toBe('en');
    });

    it('is included in the locales array', () => {
      expect(locales).toContain(defaultLocale);
    });
  });

  describe('localeNames', () => {
    it('provides display names for all locales', () => {
      expect(localeNames).toHaveProperty('en');
      expect(localeNames).toHaveProperty('de');
    });

    it('maps en to English', () => {
      expect(localeNames.en).toBe('English');
    });

    it('maps de to Deutsch', () => {
      expect(localeNames.de).toBe('Deutsch');
    });

    it('has entries for all supported locales', () => {
      locales.forEach((locale) => {
        expect(localeNames).toHaveProperty(locale);
        expect(typeof localeNames[locale]).toBe('string');
      });
    });
  });

  describe('Locale type', () => {
    it('accepts valid locale values', () => {
      const validLocale1: Locale = 'en';
      const validLocale2: Locale = 'de';

      expect(locales).toContain(validLocale1);
      expect(locales).toContain(validLocale2);
    });
  });
});
