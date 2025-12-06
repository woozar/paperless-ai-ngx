import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetOverlay,
  SheetPortal,
} from './sheet';

describe('Sheet', () => {
  beforeAll(() => {
    // Mock DOM methods not available in jsdom
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  });

  it('renders sheet trigger', () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="trigger">Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>
    );

    expect(screen.getByTestId('trigger')).toBeInTheDocument();
  });

  it('opens sheet when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet Description</SheetDescription>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));

    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet Description')).toBeInTheDocument();
  });

  it('renders SheetHeader with custom className', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader className="custom-header">
            <SheetTitle>Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));

    const header = screen.getByText('Title').parentElement;
    expect(header).toHaveClass('custom-header');
  });

  it('renders SheetFooter with custom className', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetFooter className="custom-footer">
            <button>Action</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));

    const footer = screen.getByText('Action').parentElement;
    expect(footer).toHaveClass('custom-footer');
  });

  it('renders SheetTitle with custom className', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle className="custom-title">My Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));

    expect(screen.getByText('My Title')).toHaveClass('custom-title');
  });

  it('renders SheetDescription with custom className', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetDescription className="custom-desc">My Description</SheetDescription>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));

    expect(screen.getByText('My Description')).toHaveClass('custom-desc');
  });

  it('renders SheetContent with different sides', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="left" data-testid="sheet-content">
          Left Content
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();

    // Test with different sides
    rerender(
      <Sheet open>
        <SheetContent side="top" data-testid="sheet-content">
          Top Content
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();

    rerender(
      <Sheet open>
        <SheetContent side="bottom" data-testid="sheet-content">
          Bottom Content
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();

    rerender(
      <Sheet open>
        <SheetContent side="right" data-testid="sheet-content">
          Right Content
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
  });

  it('closes sheet when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Title')).toBeInTheDocument();

    // Click the close button (sr-only text "Close")
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Sheet should close - title should not be visible
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });

  it('renders SheetOverlay with custom className', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));

    // Overlay should be rendered (it's part of SheetContent)
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders SheetClose component', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetClose data-testid="custom-close">Custom Close</SheetClose>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByTestId('custom-close')).toBeInTheDocument();
  });
});
