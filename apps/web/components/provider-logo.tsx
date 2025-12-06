'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Cpu } from 'lucide-react';

const PROVIDER_LOGOS: Record<string, { light: string; dark?: string }> = {
  openai: { light: '/vendors/openai-chatgpt.svg' },
  anthropic: { light: '/vendors/anthropic-claude.svg' },
  google: { light: '/vendors/google-gemini.svg' },
  ollama: { light: '/vendors/ollama-light.svg', dark: '/vendors/ollama-dark.png' },
};

interface ProviderLogoProps {
  provider: string;
  size?: number;
  className?: string;
}

export function ProviderLogo({ provider, size = 24, className }: Readonly<ProviderLogoProps>) {
  const { resolvedTheme } = useTheme();
  const logos = PROVIDER_LOGOS[provider.toLowerCase()];

  if (!logos) {
    return <Cpu className={className} style={{ width: size, height: size }} />;
  }

  const src = resolvedTheme === 'dark' && logos.dark ? logos.dark : logos.light;

  return <Image src={src} alt={provider} width={size} height={size} className={className} />;
}
