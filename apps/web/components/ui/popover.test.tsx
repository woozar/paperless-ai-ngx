import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Popover, PopoverAnchor, PopoverTrigger, PopoverContent } from './popover';

describe('PopoverAnchor', () => {
  it('renders with data-slot attribute', () => {
    render(
      <Popover>
        <PopoverAnchor data-testid="anchor">Anchor Content</PopoverAnchor>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('data-slot', 'popover-anchor');
  });
});
