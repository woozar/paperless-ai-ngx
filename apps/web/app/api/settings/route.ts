import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { ApiResponses } from '@/lib/api/responses';
import { adminRoute } from '@/lib/api/route-wrapper';
import {
  getSettingKeys,
  getSettingsDefaults,
  parseStoredSettingValue,
  SettingsParseError,
  type Settings,
} from '@/lib/api/schemas/settings';

// GET /api/settings - Get all settings (Admin only)
export const GET = adminRoute(
  async () => {
    try {
      // Get all settings from database
      const dbSettings = await prisma.setting.findMany({
        where: {
          settingKey: {
            in: getSettingKeys(),
          },
        },
      });

      // Build settings object with defaults, parsing stored values to proper types
      const settings: Settings = { ...getSettingsDefaults() };

      for (const dbSetting of dbSettings) {
        const key = dbSetting.settingKey as keyof Settings;
        if (key in settings) {
          (settings as Record<string, unknown>)[key] = parseStoredSettingValue(
            key,
            dbSetting.settingValue
          );
        }
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
  { errorLogPrefix: 'Get settings' }
);
