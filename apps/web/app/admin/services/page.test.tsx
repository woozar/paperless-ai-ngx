import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import ServicesPage from './page';

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/admin/services',
}));

const mockUser = vi.fn();
const mockIsAuthLoading = vi.fn();

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ user: mockUser(), isLoading: mockIsAuthLoading() }),
}));

vi.mock('@/components/settings-provider', () => ({
  useSettings: () => ({
    settings: { 'security.sharing.mode': 'BASIC' as const },
    updateSetting: vi.fn(),
  }),
}));

const mockClient = {};
vi.mock('@/lib/use-api', () => ({
  useApi: () => mockClient,
}));

vi.mock('@/hooks/use-format-date', () => ({
  useFormatDate: () => (dateString: string) => new Date(dateString).toLocaleDateString(),
}));

// Mock content components
vi.mock('./_components', () => ({
  AiAccountsContent: () => <div data-testid="ai-accounts-content">AI Accounts Content</div>,
  AiModelsContent: () => <div data-testid="ai-models-content">AI Models Content</div>,
  AiBotsContent: () => <div data-testid="ai-bots-content">AI Bots Content</div>,
  PaperlessInstancesContent: () => (
    <div data-testid="paperless-instances-content">Paperless Instances Content</div>
  ),
}));

describe('ServicesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.mockReturnValue({ id: 'user-1', username: 'admin', role: 'ADMIN' });
    mockIsAuthLoading.mockReturnValue(false);
    mockSearchParams.delete('tab');
  });

  it('renders with default paperless tab', async () => {
    renderWithIntl(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('paperless-instances-content')).toBeInTheDocument();
    });
  });

  it('renders with accounts tab when tab param is set', async () => {
    mockSearchParams.set('tab', 'accounts');

    renderWithIntl(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ai-accounts-content')).toBeInTheDocument();
    });
  });

  it('renders with models tab when tab param is set', async () => {
    mockSearchParams.set('tab', 'models');

    renderWithIntl(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ai-models-content')).toBeInTheDocument();
    });
  });

  it('renders with bots tab when tab param is set', async () => {
    mockSearchParams.set('tab', 'bots');

    renderWithIntl(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('ai-bots-content')).toBeInTheDocument();
    });
  });

  it('changes tab when clicking tab trigger', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /ai accounts/i })).toBeInTheDocument();
    });

    const accountsTab = screen.getByRole('tab', { name: /ai accounts/i });
    await user.click(accountsTab);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin/services?tab=accounts');
    });
  });

  it('defaults to paperless tab for invalid tab param', async () => {
    mockSearchParams.set('tab', 'invalid');

    renderWithIntl(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('paperless-instances-content')).toBeInTheDocument();
    });
  });

  it('renders all tab triggers', async () => {
    renderWithIntl(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /paperless instances/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /ai accounts/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /ai models/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /ai bots/i })).toBeInTheDocument();
    });
  });
});
