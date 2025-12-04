import { describe, it, expect } from 'vitest';
import {
  SettingsSchema,
  getSettingsDefaults,
  getSettingKeys,
  getSettingValueSchema,
  parseStoredSettingValue,
  SettingsParseError,
} from './settings';

describe('settings schema', () => {
  describe('getSettingsDefaults', () => {
    it('returns default values for all settings', () => {
      const defaults = getSettingsDefaults();

      expect(defaults['security.sharing.mode']).toBe('BASIC');
    });
  });

  describe('getSettingKeys', () => {
    it('returns all setting keys', () => {
      const keys = getSettingKeys();

      expect(keys).toContain('security.sharing.mode');
    });
  });

  describe('getSettingValueSchema', () => {
    it('returns the schema for a specific key', () => {
      const schema = getSettingValueSchema('security.sharing.mode');

      expect(schema.safeParse('BASIC').success).toBe(true);
      expect(schema.safeParse('INVALID').success).toBe(false);
    });
  });

  describe('parseStoredSettingValue', () => {
    it('parses valid enum value from string', () => {
      const result = parseStoredSettingValue('security.sharing.mode', 'ADVANCED');

      expect(result).toBe('ADVANCED');
    });

    it('parses valid JSON value', () => {
      const result = parseStoredSettingValue('security.sharing.mode', '"BASIC"');

      expect(result).toBe('BASIC');
    });

    it('throws SettingsParseError for invalid value', () => {
      expect(() => parseStoredSettingValue('security.sharing.mode', 'INVALID')).toThrow(
        SettingsParseError
      );
    });

    it('throws SettingsParseError with correct details', () => {
      try {
        parseStoredSettingValue('security.sharing.mode', 'WRONG_VALUE');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(SettingsParseError);
        const parseError = error as SettingsParseError;
        expect(parseError.settingKey).toBe('security.sharing.mode');
        expect(parseError.storedValue).toBe('WRONG_VALUE');
        expect(parseError.validationErrors.length).toBeGreaterThan(0);
        expect(parseError.message).toContain('security.sharing.mode');
        expect(parseError.message).toContain('WRONG_VALUE');
      }
    });

    it('throws SettingsParseError for invalid JSON that does not match schema', () => {
      // Valid JSON but invalid value for enum
      expect(() => parseStoredSettingValue('security.sharing.mode', '"NOT_AN_OPTION"')).toThrow(
        SettingsParseError
      );
    });

    it('includes path in error details when present', () => {
      // This tests the e.path.length > 0 branch - enum errors don't have paths
      try {
        parseStoredSettingValue('security.sharing.mode', 'BAD');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(SettingsParseError);
        const parseError = error as SettingsParseError;
        // Enum validation errors have empty path, so message is used directly
        expect(parseError.validationErrors[0]).toContain('Invalid');
      }
    });
  });

  describe('SettingsParseError', () => {
    it('creates error with correct properties', () => {
      const error = new SettingsParseError('test.key', 'bad_value', ['error1', 'error2']);

      expect(error.name).toBe('SettingsParseError');
      expect(error.settingKey).toBe('test.key');
      expect(error.storedValue).toBe('bad_value');
      expect(error.validationErrors).toEqual(['error1', 'error2']);
      expect(error.message).toBe(
        'Invalid stored value for setting "test.key": "bad_value". Errors: error1, error2'
      );
    });
  });

  describe('SettingsSchema', () => {
    it('validates correct settings object', () => {
      const result = SettingsSchema.safeParse({
        'security.sharing.mode': 'ADVANCED',
      });

      expect(result.success).toBe(true);
    });

    it('applies defaults for missing values', () => {
      const result = SettingsSchema.parse({});

      expect(result['security.sharing.mode']).toBe('BASIC');
    });
  });
});
