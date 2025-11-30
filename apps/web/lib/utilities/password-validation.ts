/**
 * Password validation requirements and utilities
 */

export type PasswordRequirement = { key: string; check: (password: string) => boolean };

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    key: 'minLength',
    check: (password: string) => password.length >= 8,
  },
];

export type PasswordValidationResult = {
  isValid: boolean;
  failedRequirements: string[];
};

/**
 * Validates a password against all requirements
 */
export function validatePassword(password: string): PasswordValidationResult {
  const failedRequirements: string[] = PASSWORD_REQUIREMENTS.filter(
    (requirement) => !requirement.check(password)
  ).map(({ key }) => key);

  return {
    isValid: failedRequirements.length === 0,
    failedRequirements,
  };
}

/**
 * Checks if a specific requirement is met
 */
export function checkRequirement(password: string, requirementKey: string): boolean {
  const requirement = PASSWORD_REQUIREMENTS.find((req) => req.key === requirementKey);

  return requirement?.check(password) ?? false;
}
