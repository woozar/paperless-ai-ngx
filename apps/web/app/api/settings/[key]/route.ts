import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { ApiResponses } from '@/lib/api/responses';
import { adminRoute } from '@/lib/api/route-wrapper';
import {
  getSettingKeys,
  getSettingsDefaults,
  getSettingValueSchema,
  parseStoredSettingValue,
  SettingsParseError,
  type Settings,
} from '@/lib/api/schemas/settings';

// PUT /api/settings/[key] - Update a single setting (Admin only)
export const PUT = adminRoute<never, { key: string }>(
  async ({ params, request }) => {
    try {
      const validKeys = getSettingKeys();

      if (!validKeys.includes(params.key as keyof Settings)) {
        return ApiResponses.notFound();
      }

      const body = await request.json();
      const valueSchema = getSettingValueSchema(params.key as keyof Settings);
      const parsed = valueSchema.safeParse(body.value);

      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        // v8 ignore next -- @preserve - no test case possible for issue.expected
        const expectedType =
          issue && 'expected' in issue ? String(issue.expected) : (issue?.message ?? 'unknown');
        return ApiResponses.settingsValidationError({
          key: params.key,
          value: String(body.value),
          expectedType,
        });
      }

      // Convert value to string for storage (DB stores all values as strings)
      const value = typeof parsed.data === 'string' ? parsed.data : JSON.stringify(parsed.data);

      await prisma.setting.upsert({
        where: { settingKey: params.key },
        update: { settingValue: value },
        create: { settingKey: params.key, settingValue: value },
      });

      // Return updated settings with proper types
      const dbSettings = await prisma.setting.findMany({
        where: { settingKey: { in: validKeys } },
      });

      const settings: Settings = { ...getSettingsDefaults() };
      for (const dbSetting of dbSettings) {
        const settingKey = dbSetting.settingKey as keyof Settings;
        (settings as Record<string, unknown>)[settingKey] = parseStoredSettingValue(
          settingKey,
          dbSetting.settingValue
        );
      }

      return NextResponse.json(settings);
    } catch (error) {
      if (error instanceof SettingsParseError) {
        return ApiResponses.settingsParseError({
          key: error.settingKey,
          value: error.storedValue,
          errors: error.validationErrors.join(', '),
        });
      }
      throw error; // Re-throw for wrapper to handle
    }
  },
  { errorLogPrefix: 'Update setting' }
);
