import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/locales/en.json';
import { QueueStatsCards } from './queue-stats-cards';

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
};

describe('QueueStatsCards', () => {
  it('renders all four stat cards', () => {
    renderWithProviders(
      <QueueStatsCards stats={{ pending: 0, processing: 0, completed: 0, failed: 0 }} />
    );

    expect(screen.getByTestId('queue-stats-pending')).toBeInTheDocument();
    expect(screen.getByTestId('queue-stats-processing')).toBeInTheDocument();
    expect(screen.getByTestId('queue-stats-completed')).toBeInTheDocument();
    expect(screen.getByTestId('queue-stats-failed')).toBeInTheDocument();
  });

  it('displays pending count', () => {
    renderWithProviders(
      <QueueStatsCards stats={{ pending: 5, processing: 0, completed: 0, failed: 0 }} />
    );

    const pendingCard = screen.getByTestId('queue-stats-pending');
    expect(pendingCard).toHaveTextContent('5');
  });

  it('displays processing count', () => {
    renderWithProviders(
      <QueueStatsCards stats={{ pending: 0, processing: 3, completed: 0, failed: 0 }} />
    );

    const processingCard = screen.getByTestId('queue-stats-processing');
    expect(processingCard).toHaveTextContent('3');
  });

  it('displays completed count', () => {
    renderWithProviders(
      <QueueStatsCards stats={{ pending: 0, processing: 0, completed: 10, failed: 0 }} />
    );

    const completedCard = screen.getByTestId('queue-stats-completed');
    expect(completedCard).toHaveTextContent('10');
  });

  it('displays failed count', () => {
    renderWithProviders(
      <QueueStatsCards stats={{ pending: 0, processing: 0, completed: 0, failed: 7 }} />
    );

    const failedCard = screen.getByTestId('queue-stats-failed');
    expect(failedCard).toHaveTextContent('7');
  });

  it('displays all stats correctly', () => {
    renderWithProviders(
      <QueueStatsCards stats={{ pending: 5, processing: 3, completed: 10, failed: 2 }} />
    );

    expect(screen.getByTestId('queue-stats-pending')).toHaveTextContent('5');
    expect(screen.getByTestId('queue-stats-processing')).toHaveTextContent('3');
    expect(screen.getByTestId('queue-stats-completed')).toHaveTextContent('10');
    expect(screen.getByTestId('queue-stats-failed')).toHaveTextContent('2');
  });

  it('displays card titles from translations', () => {
    renderWithProviders(
      <QueueStatsCards stats={{ pending: 0, processing: 0, completed: 0, failed: 0 }} />
    );

    expect(screen.getByText(messages.admin.queue.stats.pending)).toBeInTheDocument();
    expect(screen.getByText(messages.admin.queue.stats.processing)).toBeInTheDocument();
    expect(screen.getByText(messages.admin.queue.stats.completed)).toBeInTheDocument();
    expect(screen.getByText(messages.admin.queue.stats.failed)).toBeInTheDocument();
  });
});
