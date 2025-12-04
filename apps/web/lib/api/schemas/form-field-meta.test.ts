import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { selectOptions, getFieldMeta } from './form-field-meta';

describe('form-field-meta', () => {
  describe('selectOptions', () => {
    it('converts object to SelectOption array', () => {
      const result = selectOptions({ DEFAULT: 'default', ADMIN: 'admin' });

      expect(result).toEqual([
        { value: 'DEFAULT', labelKey: 'default' },
        { value: 'ADMIN', labelKey: 'admin' },
      ]);
    });

    it('handles empty object', () => {
      const result = selectOptions({});

      expect(result).toEqual([]);
    });

    it('handles single option', () => {
      const result = selectOptions({ ONLY: 'only' });

      expect(result).toEqual([{ value: 'ONLY', labelKey: 'only' }]);
    });
  });

  describe('getFieldMeta', () => {
    it('returns metadata from schema with .meta()', () => {
      const schema = z.string().meta({ inputType: 'text', labelKey: 'name' });

      const result = getFieldMeta(schema);

      expect(result).toEqual({ inputType: 'text', labelKey: 'name' });
    });

    it('returns undefined for schema without .meta()', () => {
      const schema = z.string();

      const result = getFieldMeta(schema);

      expect(result).toBeUndefined();
    });

    it('returns full metadata with all properties', () => {
      const schema = z.string().meta({
        inputType: 'select',
        labelKey: 'role',
        options: [{ value: 'A', labelKey: 'a' }],
        validate: true,
        showWhen: { field: 'type', values: ['x'] },
      });

      const result = getFieldMeta(schema);

      expect(result).toEqual({
        inputType: 'select',
        labelKey: 'role',
        options: [{ value: 'A', labelKey: 'a' }],
        validate: true,
        showWhen: { field: 'type', values: ['x'] },
      });
    });
  });
});
