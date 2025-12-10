import { describe, it, expect } from 'vitest';
import { CreateAiModelFormSchema, EditAiModelFormSchema } from './ai-models-ui';

describe('AI Models UI Schemas', () => {
  describe('CreateAiModelFormSchema', () => {
    it('validates valid create model data', () => {
      const validData = {
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: '0.03',
        outputTokenPrice: '0.06',
      };

      const result = CreateAiModelFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('GPT-4');
        expect(result.data.inputTokenPrice).toBe(0.03);
      }
    });

    it('transforms comma decimal separator to dot', () => {
      const dataWithComma = {
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: '0,03',
        outputTokenPrice: '0,06',
      };

      const result = CreateAiModelFormSchema.safeParse(dataWithComma);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.inputTokenPrice).toBe(0.03);
        expect(result.data.outputTokenPrice).toBe(0.06);
      }
    });

    it('accepts null for optional price fields', () => {
      const dataWithNullPrices = {
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: '',
        outputTokenPrice: '',
      };

      const result = CreateAiModelFormSchema.safeParse(dataWithNullPrices);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.inputTokenPrice).toBeNull();
        expect(result.data.outputTokenPrice).toBeNull();
      }
    });

    it('returns null for unparseable price string (NaN case)', () => {
      const dataWithInvalidPrice = {
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: 'not-a-number',
        outputTokenPrice: 'abc',
      };

      const result = CreateAiModelFormSchema.safeParse(dataWithInvalidPrice);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.inputTokenPrice).toBeNull();
        expect(result.data.outputTokenPrice).toBeNull();
      }
    });

    it('rejects empty name', () => {
      const invalidData = {
        name: '',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: '0.03',
        outputTokenPrice: '0.06',
      };

      const result = CreateAiModelFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty modelIdentifier', () => {
      const invalidData = {
        name: 'GPT-4',
        modelIdentifier: '',
        aiAccountId: 'account-1',
        inputTokenPrice: '0.03',
        outputTokenPrice: '0.06',
      };

      const result = CreateAiModelFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty aiAccountId', () => {
      const invalidData = {
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: '',
        inputTokenPrice: '0.03',
        outputTokenPrice: '0.06',
      };

      const result = CreateAiModelFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects negative prices', () => {
      const invalidData = {
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: '-0.03',
        outputTokenPrice: '0.06',
      };

      const result = CreateAiModelFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('trims whitespace from name', () => {
      const dataWithWhitespace = {
        name: '  GPT-4  ',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: '0.03',
        outputTokenPrice: '0.06',
      };

      const result = CreateAiModelFormSchema.safeParse(dataWithWhitespace);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('GPT-4');
      }
    });

    it('rejects name longer than 100 characters', () => {
      const invalidData = {
        name: 'a'.repeat(101),
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: '0.03',
        outputTokenPrice: '0.06',
      };

      const result = CreateAiModelFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('EditAiModelFormSchema', () => {
    it('validates valid edit model data', () => {
      const validData = {
        name: 'GPT-4 Updated',
        modelIdentifier: 'gpt-4-turbo',
        aiAccountId: 'account-2',
        inputTokenPrice: '0.04',
        outputTokenPrice: '0.08',
      };

      const result = EditAiModelFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('GPT-4 Updated');
      }
    });

    it('has same validation rules as CreateAiModelFormSchema', () => {
      const dataWithComma = {
        name: 'GPT-4',
        modelIdentifier: 'gpt-4',
        aiAccountId: 'account-1',
        inputTokenPrice: '0,03',
        outputTokenPrice: '0,06',
      };

      const result = EditAiModelFormSchema.safeParse(dataWithComma);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.inputTokenPrice).toBe(0.03);
        expect(result.data.outputTokenPrice).toBe(0.06);
      }
    });
  });
});
