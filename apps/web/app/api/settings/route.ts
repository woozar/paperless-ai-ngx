import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getAuthUser } from '@/lib/auth/jwt';
import { ApiResponses } from '@/lib/api/responses';
import {
  getSettingKeys,
  getSettingsDefaults,
  parseStoredSettingValue,
  SettingsParseError,
  type Settings,
} from '@/lib/api/schemas/settings';

// GET /api/settings - Get all settings (Admin only)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return ApiResponses.unauthorized();
    }

    if (authUser.role !== 'ADMIN') {
      return ApiResponses.forbidden();
    }

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
    console.error('Get settings error:', error);
    return ApiResponses.serverError();
  }
}
