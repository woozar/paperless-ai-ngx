import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  CommandDialog,
  CommandSeparator,
  CommandShortcut,
  Command,
  CommandList,
  CommandGroup,
} from './command';

describe('CommandDialog', () => {
  it('renders dialog with title and description', () => {
    render(
      <CommandDialog open={true} title="Test Title" description="Test Description">
        <CommandList>
          <CommandGroup>Test Content</CommandGroup>
        </CommandList>
      </CommandDialog>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('uses default title and description when not provided', () => {
    render(
      <CommandDialog open={true}>
        <CommandList>
          <CommandGroup>Content</CommandGroup>
        </CommandList>
      </CommandDialog>
    );

    expect(screen.getByText('Command Palette')).toBeInTheDocument();
    expect(screen.getByText('Search for a command to run...')).toBeInTheDocument();
  });
});

describe('CommandSeparator', () => {
  it('renders separator with custom className', () => {
    render(
      <Command>
        <CommandSeparator className="custom-separator" data-testid="separator" />
      </Command>
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('custom-separator');
  });
});

describe('CommandShortcut', () => {
  it('renders shortcut text', () => {
    render(<CommandShortcut>Ctrl+K</CommandShortcut>);

    expect(screen.getByText('Ctrl+K')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <CommandShortcut className="custom-shortcut" data-testid="shortcut">
        Esc
      </CommandShortcut>
    );

    const shortcut = screen.getByTestId('shortcut');
    expect(shortcut).toHaveClass('custom-shortcut');
    expect(shortcut).toHaveAttribute('data-slot', 'command-shortcut');
  });
});
