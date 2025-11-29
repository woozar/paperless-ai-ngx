import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  it('renders label with text', () => {
    render(<Label>Label Text</Label>);
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>);
    const label = screen.getByText('Custom Label');
    expect(label).toHaveClass('custom-label');
  });

  it('forwards additional props', () => {
    render(<Label data-testid="test-label">Test</Label>);
    expect(screen.getByTestId('test-label')).toBeInTheDocument();
  });

  it('works with htmlFor attribute', () => {
    render(
      <>
        <Label htmlFor="test-input">Input Label</Label>
        <input id="test-input" />
      </>
    );
    const label = screen.getByText('Input Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('renders as Radix Label component', () => {
    render(<Label>Radix Label</Label>);
    const label = screen.getByText('Radix Label');
    // Radix Label components should have the proper role
    expect(label.tagName).toBe('LABEL');
  });
});
