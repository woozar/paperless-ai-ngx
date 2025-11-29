import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders skeleton element', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Skeleton className="custom-skeleton" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('custom-skeleton');
  });

  it('has animate-pulse class by default', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('has data-slot attribute', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
  });

  it('forwards additional props', () => {
    render(<Skeleton aria-label="Loading content" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
  });

  it('renders with custom width and height', () => {
    render(<Skeleton className="h-4 w-20" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-4', 'w-20');
  });

  it('can be used for different shapes', () => {
    const { rerender } = render(<Skeleton className="rounded-full" data-testid="skeleton" />);
    let skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('rounded-full');

    rerender(<Skeleton className="rounded-none" data-testid="skeleton" />);
    skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('rounded-none');
  });
});
