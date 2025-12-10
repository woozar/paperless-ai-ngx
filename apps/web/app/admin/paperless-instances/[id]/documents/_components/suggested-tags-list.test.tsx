import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { SuggestedTagsList } from './suggested-tags-list';

const messages = {
  admin: {
    documents: {
      analyze: {
        existingTag: 'Existing',
        newTag: 'New',
      },
    },
  },
};

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('SuggestedTagsList', () => {
  it('renders existing tags with blue border and "Existing" tooltip', () => {
    renderWithIntl(<SuggestedTagsList tags={[{ id: 1, name: 'Finance' }]} />);

    const badge = screen.getByText('Finance').closest('[title]');
    expect(badge).toHaveAttribute('title', 'Existing');
    expect(badge).toHaveClass('border-blue-500');
  });

  it('renders new tags with green border, + prefix and "New" tooltip', () => {
    renderWithIntl(<SuggestedTagsList tags={[{ name: 'New Tag' }]} />);

    const badge = screen.getByText('New Tag').closest('[title]');
    expect(badge).toHaveAttribute('title', 'New');
    expect(badge).toHaveClass('border-green-500');
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders mix of existing and new tags correctly', () => {
    renderWithIntl(
      <SuggestedTagsList tags={[{ id: 1, name: 'Existing Tag' }, { name: 'New Tag' }]} />
    );

    expect(screen.getByText('Existing Tag')).toBeInTheDocument();
    expect(screen.getByText('New Tag')).toBeInTheDocument();

    const existingBadge = screen.getByText('Existing Tag').closest('[title]');
    expect(existingBadge).toHaveAttribute('title', 'Existing');

    const newBadge = screen.getByText('New Tag').closest('[title]');
    expect(newBadge).toHaveAttribute('title', 'New');
  });

  it('renders empty list without errors', () => {
    const { container } = renderWithIntl(<SuggestedTagsList tags={[]} />);
    expect(container.querySelector('.flex')).toBeInTheDocument();
  });

  it('uses id as fallback display when existing tag has no name', () => {
    renderWithIntl(<SuggestedTagsList tags={[{ id: 42 }]} />);

    expect(screen.getByText('#42')).toBeInTheDocument();
  });
});
