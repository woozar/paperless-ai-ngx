import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import ChangePasswordPage from './page';
import { renderWithIntl } from '@/test-utils/render-with-intl';

const mockPush = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/auth-provider', () => ({
  useAuth: () => ({ updateUser: mockUpdateUser }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock the ChangePasswordForm to test onSuccess callback
const mockOnSuccess = vi.fn();
vi.mock('@/app/profile/_components/change-password-form', () => ({
  ChangePasswordForm: ({ onSuccess }: { onSuccess: () => void }) => {
    mockOnSuccess.mockImplementation(onSuccess);
    return <div data-testid="change-password-form">Mocked Form</div>;
  },
}));

describe('ChangePasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page with card layout and header', () => {
    renderWithIntl(<ChangePasswordPage />);

    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByText('You must change your password before continuing')).toBeInTheDocument();
    expect(screen.getByText('Paperless AI ngx')).toBeInTheDocument();
  });

  it('renders the ChangePasswordForm component', () => {
    renderWithIntl(<ChangePasswordPage />);

    expect(screen.getByTestId('change-password-form')).toBeInTheDocument();
  });

  it('calls updateUser and redirects to home on success', () => {
    renderWithIntl(<ChangePasswordPage />);

    // Simulate the onSuccess callback being called
    mockOnSuccess();

    expect(mockUpdateUser).toHaveBeenCalledWith({ mustChangePassword: false });
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
