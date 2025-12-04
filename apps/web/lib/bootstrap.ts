import { Prisma, prisma } from '@repo/database';
import { generateSalt, hashPassword } from './utilities/password';
import { getSettingKeys, getSettingsDefaults } from './api/schemas/settings';

const SALT_SETTING_KEY = 'security.secrets.salt';

export class BootstrapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BootstrapError';
  }
}

/**
 * Bootstraps the application by ensuring:
 * 1. A salt exists in the settings table
 * 2. An admin user exists (created from ADMIN_INITIAL_PASSWORD env var if needed)
 *
 * Uses Serializable isolation level to prevent race conditions.
 * If a concurrent transaction completes first (P2034), we gracefully skip
 * since the other transaction already created the required data.
 *
 * @throws BootstrapError if ADMIN_INITIAL_PASSWORD is not set and no users exist
 */
export async function bootstrapApplication(): Promise<void> {
  try {
    await prisma.$transaction(
      async (tx) => {
        // Step 1: Ensure salt exists
        let salt = await tx.setting.findUnique({
          where: { settingKey: SALT_SETTING_KEY },
        });

        if (!salt) {
          const newSalt = generateSalt();
          salt = await tx.setting.create({
            data: {
              settingKey: SALT_SETTING_KEY,
              settingValue: newSalt,
            },
          });
        }

        // Step 2: Check if any users exist
        const userCount = await tx.user.count();

        if (userCount === 0) {
          // No users exist - we need to create the initial admin
          const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

          if (!initialPassword) {
            throw new BootstrapError(
              'No users exist and ADMIN_INITIAL_PASSWORD environment variable is not set. ' +
                'Please set ADMIN_INITIAL_PASSWORD to create the initial admin user.'
            );
          }

          const passwordHash = hashPassword(initialPassword, salt.settingValue);

          await tx.user.create({
            data: {
              username: 'admin',
              passwordHash,
              role: 'ADMIN',
              mustChangePassword: true,
              isActive: true,
            },
          });

          console.log('Initial admin user created successfully.');
        }

        // Step 3: Ensure default settings exist
        const settingKeys = getSettingKeys();
        const defaults = getSettingsDefaults();

        for (const key of settingKeys) {
          const existing = await tx.setting.findUnique({
            where: { settingKey: key },
          });

          if (!existing) {
            await tx.setting.create({
              data: {
                settingKey: key,
                settingValue: String(defaults[key]),
              },
            });
          }
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  } catch (error) {
    // P2034: Transaction failed due to a write conflict or deadlock
    // This means another concurrent transaction completed first - that's fine
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      console.log('Bootstrap: Concurrent transaction completed first, skipping.');
      return;
    }
    throw error;
  }
}

/**
 * Gets the application salt from the settings table
 * @returns The salt string or null if not found
 */
export async function getSalt(): Promise<string | null> {
  const salt = await prisma.setting.findUnique({
    where: { settingKey: SALT_SETTING_KEY },
  });
  return salt?.settingValue ?? null;
}
