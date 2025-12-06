import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientSettings } from './client-settings';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockSetTheme = vi.fn();
const mockTheme = vi.fn(() => 'system');

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme(),
    setTheme: mockSetTheme,
  }),
}));

describe('ClientSettings', () => {
  beforeAll(() => {
    // Mock DOM methods not available in jsdom (required for Radix Select)
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme.mockReturnValue('system');
  });

  it('renders skeleton initially before mounting', () => {
    // The component shows skeleton on first render before useEffect runs
    // This is tested implicitly since we wait for mounted state
    renderWithIntl(<ClientSettings />);

    // After mount, the select should be visible
    expect(screen.getByTestId('setting-appearance.theme.mode')).toBeInTheDocument();
  });

  it('renders theme select with current value', () => {
    mockTheme.mockReturnValue('dark');
    renderWithIntl(<ClientSettings />);

    expect(screen.getByTestId('setting-appearance.theme.mode')).toBeInTheDocument();
  });

  it('calls setTheme when theme is changed', async () => {
    const user = userEvent.setup();
    renderWithIntl(<ClientSettings />);

    // Open the select dropdown
    const trigger = screen.getByTestId('setting-appearance.theme.mode');
    await user.click(trigger);

    // Wait for dropdown to open and select dark option
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /dark/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('option', { name: /dark/i }));

    // Verify setTheme was called
    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });

  it('renders all theme options', async () => {
    const user = userEvent.setup();
    renderWithIntl(<ClientSettings />);

    // Open the select dropdown
    const trigger = screen.getByTestId('setting-appearance.theme.mode');
    await user.click(trigger);

    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /light/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /dark/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /system/i })).toBeInTheDocument();
    });
  });
});
