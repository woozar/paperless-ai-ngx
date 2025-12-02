import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider, IntlErrorCode } from 'next-intl';
import { ReactElement } from 'react';
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

export function renderWithIntl(ui: ReactElement, options?: CustomRenderOptions) {
  const result = render(
    <NextIntlClientProvider
      locale="en"
      messages={messages}
      timeZone="UTC"
      onError={onError}
      getMessageFallback={getMessageFallback}
    >
      {ui}
    </NextIntlClientProvider>,
    options
  );

  return {
    ...result,
    rerender: (rerenderUi: ReactElement) =>
      result.rerender(
        <NextIntlClientProvider
          locale="en"
          messages={messages}
          timeZone="UTC"
          onError={onError}
          getMessageFallback={getMessageFallback}
        >
          {rerenderUi}
        </NextIntlClientProvider>
      ),
  };
}
