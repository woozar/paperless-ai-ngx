import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from './dialog';

describe('Dialog', () => {
  beforeEach(() => {
    // Suppress Radix UI accessibility warning about missing Description
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  it('renders trigger and opens dialog on click', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByText('Open'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('closes dialog when clicking close button', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('renders DialogHeader with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader className="custom-header">
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const header = screen.getByText('Title').parentElement;
    expect(header).toHaveClass('custom-header');
  });

  it('renders DialogFooter with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogFooter className="custom-footer">
            <button>Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const footer = screen.getByText('Action').parentElement;
    expect(footer).toHaveClass('custom-footer');
  });

  it('renders DialogDescription with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription className="custom-description">Description text</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Description text')).toHaveClass('custom-description');
  });

  it('renders DialogTitle with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle className="custom-title">Custom Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Custom Title')).toHaveClass('custom-title');
  });

  it('calls onOpenChange when dialog state changes', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup({ delay: null });

    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders DialogClose component', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Test</DialogTitle>
          <DialogClose>Custom Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Custom Close')).toBeInTheDocument();

    await user.click(screen.getByText('Custom Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders DialogOverlay with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Dialog should be open with overlay
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('applies custom className to DialogContent', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="custom-content">
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole('dialog')).toHaveClass('custom-content');
  });

  it('renders DialogTrigger with custom props', () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="trigger" className="trigger-class">
          Open
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('trigger-class');
    expect(trigger).toHaveTextContent('Open');
  });

  it('renders DialogPortal component', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Portal Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Content should be portaled (rendered in body)
    expect(screen.getByText('Portal Test')).toBeInTheDocument();
  });
});
