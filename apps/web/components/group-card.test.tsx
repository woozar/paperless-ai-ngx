import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupCard, type SettingField } from './group-card';
import { renderWithIntl, messages } from '@/test-utils/render-with-intl';
import type { Settings } from '@/lib/api/schemas/settings';

// Helper to get nested translation value
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path; // Return key as fallback
    }
  }
  return typeof current === 'string' ? current : path;
}

// Create a mock translation function that returns actual translations or fallback
const mockT = vi.fn((key: string) => getNestedValue(messages, key));

describe('GroupCard', () => {
  const mockOnFieldChange = vi.fn();

  const defaultProps = {
    sectionKey: 'security',
    groupKey: 'sharing',
    settings: {
      'security.sharing.mode': 'BASIC',
    } as Settings,
    savingKey: null,
    onFieldChange: mockOnFieldChange,
    t: mockT as unknown as ReturnType<typeof import('next-intl').useTranslations>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    // Mock DOM methods not available in jsdom (required for Radix Select)
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  });

  it('renders card with title and description', () => {
    const fields: SettingField[] = [
      {
        key: 'security.sharing.mode',
        section: 'security',
        group: 'sharing',
        name: 'mode',
        type: 'enum',
        enumValues: ['BASIC', 'ADVANCED'],
      },
    ];

    renderWithIntl(<GroupCard {...defaultProps} fields={fields} />);

    expect(screen.getByText('Sharing')).toBeInTheDocument();
    expect(
      screen.getByText('Configure how resources can be shared between users')
    ).toBeInTheDocument();
  });

  it('renders enum field as select', async () => {
    const fields: SettingField[] = [
      {
        key: 'security.sharing.mode',
        section: 'security',
        group: 'sharing',
        name: 'mode',
        type: 'enum',
        enumValues: ['BASIC', 'ADVANCED'],
      },
    ];

    renderWithIntl(<GroupCard {...defaultProps} fields={fields} />);

    const select = screen.getByTestId('setting-security.sharing.mode');
    expect(select).toBeInTheDocument();
  });

  it('renders boolean field as switch', () => {
    const fields: SettingField[] = [
      {
        key: 'general.features.enabled' as keyof Settings,
        section: 'general',
        group: 'features',
        name: 'enabled',
        type: 'boolean',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="general"
        groupKey="features"
        fields={fields}
        settings={{ 'general.features.enabled': true } as Settings}
      />
    );

    const switchEl = screen.getByTestId('setting-general.features.enabled');
    expect(switchEl).toHaveRole('switch');
  });

  it('renders string field as text input', () => {
    const fields: SettingField[] = [
      {
        key: 'general.features.name' as keyof Settings,
        section: 'general',
        group: 'features',
        name: 'name',
        type: 'string',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="general"
        groupKey="features"
        fields={fields}
        settings={{ 'general.features.name': 'test-value' } as Settings}
      />
    );

    const input = screen.getByTestId('setting-general.features.name');
    expect(input).toHaveValue('test-value');
  });

  it('renders secret field as password input', () => {
    const fields: SettingField[] = [
      {
        key: 'security.api.key' as keyof Settings,
        section: 'security',
        group: 'api',
        name: 'key',
        type: 'string',
        isSecret: true,
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="security"
        groupKey="api"
        fields={fields}
        settings={{ 'security.api.key': 'secret-123' } as Settings}
      />
    );

    const input = screen.getByTestId('setting-security.api.key');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('calls onFieldChange when select value changes', async () => {
    const user = userEvent.setup();
    const fields: SettingField[] = [
      {
        key: 'security.sharing.mode',
        section: 'security',
        group: 'sharing',
        name: 'mode',
        type: 'enum',
        enumValues: ['BASIC', 'ADVANCED'],
      },
    ];

    renderWithIntl(<GroupCard {...defaultProps} fields={fields} />);

    const trigger = screen.getByTestId('setting-security.sharing.mode');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /advanced/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('option', { name: /advanced/i }));

    expect(mockOnFieldChange).toHaveBeenCalledWith(fields[0], 'ADVANCED');
  });

  it('calls onFieldChange when switch is toggled', async () => {
    const user = userEvent.setup();
    const fields: SettingField[] = [
      {
        key: 'general.features.enabled' as keyof Settings,
        section: 'general',
        group: 'features',
        name: 'enabled',
        type: 'boolean',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="general"
        groupKey="features"
        fields={fields}
        settings={{ 'general.features.enabled': true } as Settings}
      />
    );

    const switchEl = screen.getByTestId('setting-general.features.enabled');
    await user.click(switchEl);

    expect(mockOnFieldChange).toHaveBeenCalledWith(fields[0], false);
  });

  it('disables control when savingKey matches field key', () => {
    const fields: SettingField[] = [
      {
        key: 'security.sharing.mode',
        section: 'security',
        group: 'sharing',
        name: 'mode',
        type: 'enum',
        enumValues: ['BASIC', 'ADVANCED'],
      },
    ];

    renderWithIntl(
      <GroupCard {...defaultProps} fields={fields} savingKey="security.sharing.mode" />
    );

    const trigger = screen.getByTestId('setting-security.sharing.mode');
    expect(trigger).toBeDisabled();
  });

  it('shows loading spinner for boolean field when saving', () => {
    const fields: SettingField[] = [
      {
        key: 'general.features.enabled' as keyof Settings,
        section: 'general',
        group: 'features',
        name: 'enabled',
        type: 'boolean',
      },
    ];

    const { container } = renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="general"
        groupKey="features"
        fields={fields}
        settings={{ 'general.features.enabled': true } as Settings}
        savingKey="general.features.enabled"
      />
    );

    // Loader2 icon has animate-spin class
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
