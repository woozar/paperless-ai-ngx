import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
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

  const defaultSettings: Settings = {
    'display.general.currency': 'EUR',
    'ai.context.identity': '',
    'security.sharing.mode': 'BASIC',
  };

  const defaultProps = {
    sectionKey: 'security',
    groupKey: 'sharing',
    settings: defaultSettings,
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
    // Note: Currently no boolean settings exist in the schema,
    // but we test the component's capability with a mock field
    const fields: SettingField[] = [
      {
        key: 'security.sharing.mode' as keyof Settings, // Using existing key for type compatibility
        section: 'security',
        group: 'sharing',
        name: 'enabled',
        type: 'boolean',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        fields={fields}
        settings={{ ...defaultSettings, 'security.sharing.mode': true as unknown as 'BASIC' }}
      />
    );

    const switchEl = screen.getByTestId('setting-security.sharing.mode');
    expect(switchEl).toHaveRole('switch');
  });

  it('renders string field as text input', () => {
    const fields: SettingField[] = [
      {
        key: 'ai.context.identity',
        section: 'ai',
        group: 'context',
        name: 'identity',
        type: 'string',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="ai"
        groupKey="context"
        fields={fields}
        settings={{ ...defaultSettings, 'ai.context.identity': 'test-value' }}
      />
    );

    const input = screen.getByTestId('setting-ai.context.identity');
    expect(input).toHaveValue('test-value');
  });

  it('renders secret field as password input', () => {
    const fields: SettingField[] = [
      {
        key: 'ai.context.identity',
        section: 'ai',
        group: 'context',
        name: 'identity',
        type: 'string',
        isSecret: true,
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="ai"
        groupKey="context"
        fields={fields}
        settings={{ ...defaultSettings, 'ai.context.identity': 'secret-123' }}
      />
    );

    const input = screen.getByTestId('setting-ai.context.identity');
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
        key: 'security.sharing.mode' as keyof Settings,
        section: 'security',
        group: 'sharing',
        name: 'enabled',
        type: 'boolean',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        fields={fields}
        settings={{ ...defaultSettings, 'security.sharing.mode': true as unknown as 'BASIC' }}
      />
    );

    const switchEl = screen.getByTestId('setting-security.sharing.mode');
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
        key: 'security.sharing.mode' as keyof Settings,
        section: 'security',
        group: 'sharing',
        name: 'enabled',
        type: 'boolean',
      },
    ];

    const { container } = renderWithIntl(
      <GroupCard
        {...defaultProps}
        fields={fields}
        settings={{ ...defaultSettings, 'security.sharing.mode': true as unknown as 'BASIC' }}
        savingKey="security.sharing.mode"
      />
    );

    // Loader2 icon has animate-spin class
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('saves string field on blur', async () => {
    const user = userEvent.setup();
    const fields: SettingField[] = [
      {
        key: 'ai.context.identity',
        section: 'ai',
        group: 'context',
        name: 'identity',
        type: 'string',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="ai"
        groupKey="context"
        fields={fields}
        settings={{ ...defaultSettings, 'ai.context.identity': 'initial' }}
      />
    );

    const input = screen.getByTestId('setting-ai.context.identity');
    await user.clear(input);
    await user.type(input, 'new-value');
    await user.tab(); // Trigger blur

    expect(mockOnFieldChange).toHaveBeenCalledWith(fields[0], 'new-value');
  });

  it('saves string field on Enter key', async () => {
    const user = userEvent.setup();
    const fields: SettingField[] = [
      {
        key: 'ai.context.identity',
        section: 'ai',
        group: 'context',
        name: 'identity',
        type: 'string',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="ai"
        groupKey="context"
        fields={fields}
        settings={{ ...defaultSettings, 'ai.context.identity': 'initial' }}
      />
    );

    const input = screen.getByTestId('setting-ai.context.identity');
    await user.clear(input);
    await user.type(input, 'enter-value{Enter}');

    expect(mockOnFieldChange).toHaveBeenCalledWith(fields[0], 'enter-value');
  });

  it('saves string field after debounce delay', async () => {
    vi.useFakeTimers();
    const fields: SettingField[] = [
      {
        key: 'ai.context.identity',
        section: 'ai',
        group: 'context',
        name: 'identity',
        type: 'string',
      },
    ];

    renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="ai"
        groupKey="context"
        fields={fields}
        settings={{ ...defaultSettings, 'ai.context.identity': 'initial' }}
      />
    );

    const input = screen.getByTestId('setting-ai.context.identity');

    // Simulate typing by firing change events directly
    await act(async () => {
      input.focus();
      await vi.runOnlyPendingTimersAsync();
    });

    // Manually dispatch input event
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(
        input,
        'debounced'
      );
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // onChange should not be called immediately
    expect(mockOnFieldChange).not.toHaveBeenCalled();

    // Advance timers past debounce delay (2000ms)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });

    expect(mockOnFieldChange).toHaveBeenCalledWith(fields[0], 'debounced');

    vi.useRealTimers();
  });

  it('clears timeout on unmount', async () => {
    vi.useFakeTimers();
    const fields: SettingField[] = [
      {
        key: 'ai.context.identity',
        section: 'ai',
        group: 'context',
        name: 'identity',
        type: 'string',
      },
    ];

    const { unmount } = renderWithIntl(
      <GroupCard
        {...defaultProps}
        sectionKey="ai"
        groupKey="context"
        fields={fields}
        settings={{ ...defaultSettings, 'ai.context.identity': 'initial' }}
      />
    );

    const input = screen.getByTestId('setting-ai.context.identity');

    // Fire input change
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(
        input,
        'unmount-test'
      );
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Unmount before debounce completes
    unmount();

    // Advance time - should not throw or call handler
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });

    expect(mockOnFieldChange).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
