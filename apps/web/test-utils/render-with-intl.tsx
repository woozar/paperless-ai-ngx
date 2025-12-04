import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { NextIntlClientProvider, IntlErrorCode } from 'next-intl';
import { ReactElement, ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
export { default as messages } from '../locales/en.json';
import messages from '../locales/en.json';

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'>;

// Suppress missing message errors in tests - return the key as fallback
function onError(error: { code: IntlErrorCode }) {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    // Silently ignore missing translations in tests
    return;
  }
  console.error(error);
}

function getMessageFallback({ namespace, key }: { namespace?: string; key: string }) {
  return namespace ? `${namespace}.${key}` : key;
}

export function renderWithIntl(ui: ReactElement, options?: CustomRenderOptions): RenderResult {
  const result = render(
    <NextIntlClientProvider
      locale="en"
      messages={messages}
      timeZone="UTC"
      onError={onError}
      getMessageFallback={getMessageFallback}
    >
      <TooltipProvider>{ui}</TooltipProvider>
    </NextIntlClientProvider>,
    options
  );

  return {
    ...result,
    rerender: (rerenderUi: ReactNode) =>
      result.rerender(
        <NextIntlClientProvider
          locale="en"
          messages={messages}
          timeZone="UTC"
          onError={onError}
          getMessageFallback={getMessageFallback}
        >
          <TooltipProvider>{rerenderUi}</TooltipProvider>
        </NextIntlClientProvider>
      ),
  };
}
