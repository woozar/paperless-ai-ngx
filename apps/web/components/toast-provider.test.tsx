import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ToastProvider } from './toast-provider';

// Mock sonner
vi.mock('sonner', () => ({
  Toaster: ({ richColors, position }: { richColors?: boolean; position?: string }) => (
    <div data-testid="toaster" data-rich-colors={richColors?.toString()} data-position={position} />
  ),
}));

describe('ToastProvider', () => {
  it('renders Toaster component', () => {
    const { getByTestId } = render(<ToastProvider />);

    const toaster = getByTestId('toaster');
    expect(toaster).toBeInTheDocument();
  });

  it('configures Toaster with correct position', () => {
    const { getByTestId } = render(<ToastProvider />);

    const toaster = getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-position', 'top-right');
  });

  it('enables rich colors', () => {
    const { getByTestId } = render(<ToastProvider />);

    const toaster = getByTestId('toaster');
    expect(toaster).toHaveAttribute('data-rich-colors', 'true');
  });
});
