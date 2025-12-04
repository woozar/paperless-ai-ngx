import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { AutoSettingsPage } from './auto-settings-page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockUpdateSetting = vi.fn();
const mockUseSettings = vi.fn();

vi.mock('./settings-provider', () => ({
  useSettings: () => mockUseSettings(),
}));

// Create a test schema with all field types (inline to avoid hoisting issues)
// Also includes invalid keys to test parseSettingKey's error handling
vi.mock('@/lib/api/schemas/settings', async () => {
  const { z } = await import('zod');

  return {
    SettingsSchema: z.object({
      'security.sharing.mode': z.enum(['BASIC', 'ADVANCED']).default('BASIC'),
      'security.api.key': z.string().meta({ inputType: 'secret' }).default(''),
      'general.features.enabled': z.boolean().default(true),
      'general.features.name': z.string().default('default'),
      // Invalid keys to cover parseSettingKey branches:
      invalid: z.string().default('x'), // Only 1 part
      'two.parts': z.string().default('x'), // Only 2 parts
      'a..c': z.string().default('x'), // 3 parts but middle is empty
    }),
  };
});

describe('AutoSettingsPage', () => {
  beforeAll(() => {
    // Mock DOM methods not available in jsdom (required for Radix Select)
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateSetting.mockResolvedValue(undefined);
    mockUseSettings.mockReturnValue({
      settings: {
        'security.sharing.mode': 'BASIC',
        'security.api.key': 'secret-key-123',
        'general.features.enabled': true,
        'general.features.name': 'test-name',
      },
      isLoading: false,
      updateSetting: mockUpdateSetting,
    });
  });

  it('shows loading spinner when isLoading is true', () => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'BASIC' },
      isLoading: true,
      updateSetting: mockUpdateSetting,
    });

    const { container } = renderWithIntl(<AutoSettingsPage />);

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows loading spinner when settings is null', () => {
    mockUseSettings.mockReturnValue({
      settings: null,
      isLoading: false,
      updateSetting: mockUpdateSetting,
    });

    const { container } = renderWithIntl(<AutoSettingsPage />);

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders section title', async () => {
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Security')).toBeInTheDocument();
    });
  });

  it('renders group card with title and description', async () => {
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Sharing')).toBeInTheDocument();
      expect(
        screen.getByText('Configure how resources can be shared between users')
      ).toBeInTheDocument();
    });
  });

  it('renders enum setting as select with testid', async () => {
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setting-security.sharing.mode')).toBeInTheDocument();
    });
  });

  it('renders setting field title and description', async () => {
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Sharing Mode')).toBeInTheDocument();
      expect(
        screen.getByText('Determines whether users can share their resources with others')
      ).toBeInTheDocument();
    });
  });

  it('displays current value in select', async () => {
    mockUseSettings.mockReturnValue({
      settings: { 'security.sharing.mode': 'ADVANCED' },
      isLoading: false,
      updateSetting: mockUpdateSetting,
    });

    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      const trigger = screen.getByTestId('setting-security.sharing.mode');
      expect(trigger).toHaveTextContent(/advanced/i);
    });
  });

  it('calls updateSetting and shows success toast when value changes', async () => {
    const user = userEvent.setup();
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setting-security.sharing.mode')).toBeInTheDocument();
    });

    // Open the select dropdown
    const trigger = screen.getByTestId('setting-security.sharing.mode');
    await user.click(trigger);

    // Wait for dropdown to open and select ADVANCED option
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /advanced/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('option', { name: /advanced/i }));

    // Verify updateSetting was called with correct arguments
    await waitFor(() => {
      expect(mockUpdateSetting).toHaveBeenCalledWith('security.sharing.mode', 'ADVANCED');
    });

    // Verify success toast was shown
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('shows error toast when updateSetting fails', async () => {
    mockUpdateSetting.mockRejectedValue(new Error('Update failed'));
    const user = userEvent.setup();
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setting-security.sharing.mode')).toBeInTheDocument();
    });

    // Open the select dropdown
    const trigger = screen.getByTestId('setting-security.sharing.mode');
    await user.click(trigger);

    // Wait for dropdown to open and select ADVANCED option
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /advanced/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('option', { name: /advanced/i }));

    // Verify error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('renders boolean setting as switch', async () => {
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      const switchEl = screen.getByTestId('setting-general.features.enabled');
      expect(switchEl).toBeInTheDocument();
      expect(switchEl).toHaveRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });
  });

  it('renders string setting as input', async () => {
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      const input = screen.getByTestId('setting-general.features.name');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('test-name');
    });
  });

  it('renders secret setting with ApiKeyInput (password type)', async () => {
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      const input = screen.getByTestId('setting-security.api.key');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveValue('secret-key-123');
    });
  });

  it('calls updateSetting when switch is toggled', async () => {
    const user = userEvent.setup();
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setting-general.features.enabled')).toBeInTheDocument();
    });

    const switchEl = screen.getByTestId('setting-general.features.enabled');
    await user.click(switchEl);

    await waitFor(() => {
      expect(mockUpdateSetting).toHaveBeenCalledWith('general.features.enabled', false);
    });
  });

  it('calls updateSetting when text input is changed', async () => {
    const user = userEvent.setup();
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setting-general.features.name')).toBeInTheDocument();
    });

    const input = screen.getByTestId('setting-general.features.name');
    await user.clear(input);
    await user.type(input, 'new-value');

    await waitFor(() => {
      expect(mockUpdateSetting).toHaveBeenCalled();
    });
  });

  it('shows fallback error toast when error is not an Error instance', async () => {
    mockUpdateSetting.mockRejectedValue('string error'); // non-Error value
    const user = userEvent.setup();
    renderWithIntl(<AutoSettingsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setting-security.sharing.mode')).toBeInTheDocument();
    });

    const trigger = screen.getByTestId('setting-security.sharing.mode');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /advanced/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('option', { name: /advanced/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
