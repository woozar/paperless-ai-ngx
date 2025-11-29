import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AiActionButton } from './ai-action-button';

describe('AiActionButton component', () => {
  it('renders children correctly', () => {
    render(<AiActionButton>AI Action</AiActionButton>);
    expect(screen.getByRole('button')).toHaveTextContent('AI Action');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<AiActionButton onClick={handleClick}>Click me</AiActionButton>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<AiActionButton ref={ref}>Button</AiActionButton>);
    expect(ref).toHaveBeenCalled();
  });

  it('renders disabled state correctly', () => {
    render(<AiActionButton disabled>Disabled AI Action</AiActionButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<AiActionButton className="custom-class">Custom Class</AiActionButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
