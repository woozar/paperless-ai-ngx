import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { TagMultiselect, type TagOption } from './tag-multiselect';

const mockTags: TagOption[] = [
  { id: 1, name: 'Finance', documentCount: 10 },
  { id: 2, name: 'Important', documentCount: 5 },
  { id: 3, name: 'Archive', documentCount: 0 },
  { id: 4, name: 'NoCount' }, // Tag without documentCount
];

describe('TagMultiselect', () => {
  const defaultProps = {
    options: mockTags,
    selected: [] as number[],
    onChange: vi.fn(),
  };

  it('renders with placeholder when no tags selected', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} placeholder="Select tags..." />);

    expect(screen.getByText('Select tags...')).toBeInTheDocument();
  });

  it('renders selected tags as badges', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[1, 2]} />);

    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('displays document count in selected tags', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[1]} />);

    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('does not display document count when undefined', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[4]} />);

    expect(screen.getByText('NoCount')).toBeInTheDocument();
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} />);

    await user.click(screen.getByTestId('tag-multiselect'));

    await waitFor(() => {
      expect(screen.getByTestId('tag-multiselect-option-1')).toBeInTheDocument();
    });
  });

  it('displays document count in dropdown options', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} />);

    await user.click(screen.getByTestId('tag-multiselect'));

    await waitFor(() => {
      const option = screen.getByTestId('tag-multiselect-option-1');
      expect(option).toHaveTextContent('Finance');
      expect(option).toHaveTextContent('(10)');
    });
  });

  it('calls onChange when selecting a tag', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} onChange={onChange} />);

    await user.click(screen.getByTestId('tag-multiselect'));

    await waitFor(() => {
      expect(screen.getByTestId('tag-multiselect-option-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('tag-multiselect-option-1'));

    expect(onChange).toHaveBeenCalledWith([1]);
  });

  it('calls onChange when deselecting a tag via dropdown', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[1]} onChange={onChange} />);

    await user.click(screen.getByTestId('tag-multiselect'));

    await waitFor(() => {
      expect(screen.getByTestId('tag-multiselect-option-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('tag-multiselect-option-1'));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('removes tag when clicking X button on badge', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[1, 2]} onChange={onChange} />);

    await user.click(screen.getByTestId('tag-multiselect-remove-1'));

    expect(onChange).toHaveBeenCalledWith([2]);
  });

  it('removes tag when pressing Enter on remove button', async () => {
    const onChange = vi.fn();
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[1, 2]} onChange={onChange} />);

    const removeButton = screen.getByTestId('tag-multiselect-remove-1');
    removeButton.focus();

    // Simulate Enter key
    removeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(onChange).toHaveBeenCalledWith([2]);
  });

  it('removes tag when pressing Space on remove button', async () => {
    const onChange = vi.fn();
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[1, 2]} onChange={onChange} />);

    const removeButton = screen.getByTestId('tag-multiselect-remove-1');
    removeButton.focus();

    // Simulate Space key
    removeButton.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(onChange).toHaveBeenCalledWith([2]);
  });

  it('does not remove tag for other keys', async () => {
    const onChange = vi.fn();
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[1, 2]} onChange={onChange} />);

    const removeButton = screen.getByTestId('tag-multiselect-remove-1');
    removeButton.focus();

    // Simulate Tab key (should not trigger removal)
    removeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows checkmark for selected tags in dropdown', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} selected={[1]} />);

    await user.click(screen.getByTestId('tag-multiselect'));

    await waitFor(() => {
      const option1 = screen.getByTestId('tag-multiselect-option-1');
      const option2 = screen.getByTestId('tag-multiselect-option-2');

      // Selected tag should have visible checkmark
      const check1 = option1.querySelector('svg');
      const check2 = option2.querySelector('svg');

      expect(check1).toHaveClass('opacity-100');
      expect(check2).toHaveClass('opacity-0');
    });
  });

  it('is disabled when disabled prop is true', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} disabled />);

    expect(screen.getByTestId('tag-multiselect')).toBeDisabled();
  });

  it('is disabled when isLoading prop is true', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} isLoading />);

    expect(screen.getByTestId('tag-multiselect')).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} isLoading />);

    // Should show Loader2 with animate-spin class
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows chevron icon when not loading', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} />);

    // Should not show loading spinner
    expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('displays empty message when no options match search', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} emptyMessage="No tags found." />);

    await user.click(screen.getByTestId('tag-multiselect'));

    await waitFor(() => {
      expect(screen.getByTestId('tag-multiselect-search')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('tag-multiselect-search'), 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No tags found.')).toBeInTheDocument();
    });
  });

  it('uses custom testId', () => {
    renderWithIntl(<TagMultiselect {...defaultProps} testId="custom-select" />);

    expect(screen.getByTestId('custom-select')).toBeInTheDocument();
  });

  it('filters options when searching', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} />);

    await user.click(screen.getByTestId('tag-multiselect'));

    await waitFor(() => {
      expect(screen.getByTestId('tag-multiselect-search')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('tag-multiselect-search'), 'Fin');

    await waitFor(() => {
      expect(screen.getByTestId('tag-multiselect-option-1')).toBeInTheDocument();
      expect(screen.queryByTestId('tag-multiselect-option-2')).not.toBeInTheDocument();
    });
  });

  it('handles tags without documentCount in dropdown', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithIntl(<TagMultiselect {...defaultProps} />);

    await user.click(screen.getByTestId('tag-multiselect'));

    await waitFor(() => {
      const option = screen.getByTestId('tag-multiselect-option-4');
      expect(option).toHaveTextContent('NoCount');
      // Should not have a count in parentheses
      expect(option.textContent).not.toMatch(/\(\d+\)/);
    });
  });
});
