import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProviderLogo } from './provider-logo';

const mockResolvedTheme = vi.fn(() => 'light');

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme(),
  }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('ProviderLogo', () => {
  it('renders openai logo in light mode', () => {
    mockResolvedTheme.mockReturnValue('light');
    render(<ProviderLogo provider="openai" />);

    const img = screen.getByAltText('openai');
    expect(img).toHaveAttribute('src', '/vendors/openai-chatgpt.svg');
  });

  it('renders anthropic logo', () => {
    mockResolvedTheme.mockReturnValue('light');
    render(<ProviderLogo provider="anthropic" />);

    const img = screen.getByAltText('anthropic');
    expect(img).toHaveAttribute('src', '/vendors/anthropic-claude.svg');
  });

  it('renders google logo', () => {
    mockResolvedTheme.mockReturnValue('light');
    render(<ProviderLogo provider="google" />);

    const img = screen.getByAltText('google');
    expect(img).toHaveAttribute('src', '/vendors/google-gemini.svg');
  });

  it('renders ollama light logo in light mode', () => {
    mockResolvedTheme.mockReturnValue('light');
    render(<ProviderLogo provider="ollama" />);

    const img = screen.getByAltText('ollama');
    expect(img).toHaveAttribute('src', '/vendors/ollama-light.svg');
  });

  it('renders ollama dark logo in dark mode', () => {
    mockResolvedTheme.mockReturnValue('dark');
    render(<ProviderLogo provider="ollama" />);

    const img = screen.getByAltText('ollama');
    expect(img).toHaveAttribute('src', '/vendors/ollama-dark.png');
  });

  it('renders fallback Cpu icon for unknown provider', () => {
    mockResolvedTheme.mockReturnValue('light');
    render(<ProviderLogo provider="unknown-provider" />);

    // Cpu icon is rendered, not an img
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies custom size', () => {
    mockResolvedTheme.mockReturnValue('light');
    render(<ProviderLogo provider="openai" size={32} />);

    const img = screen.getByAltText('openai');
    expect(img).toHaveAttribute('width', '32');
    expect(img).toHaveAttribute('height', '32');
  });

  it('applies custom className', () => {
    mockResolvedTheme.mockReturnValue('light');
    render(<ProviderLogo provider="openai" className="custom-class" />);

    const img = screen.getByAltText('openai');
    expect(img).toHaveClass('custom-class');
  });

  it('handles case-insensitive provider names', () => {
    mockResolvedTheme.mockReturnValue('light');
    render(<ProviderLogo provider="OPENAI" />);

    const img = screen.getByAltText('OPENAI');
    expect(img).toHaveAttribute('src', '/vendors/openai-chatgpt.svg');
  });

  it('uses light logo when dark mode but no dark variant exists', () => {
    mockResolvedTheme.mockReturnValue('dark');
    render(<ProviderLogo provider="openai" />);

    // OpenAI has no dark variant, so light is used
    const img = screen.getByAltText('openai');
    expect(img).toHaveAttribute('src', '/vendors/openai-chatgpt.svg');
  });
});
