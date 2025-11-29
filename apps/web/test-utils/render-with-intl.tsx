import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ReactElement } from 'react';
export { default as messages } from '../locales/en.json';
import messages from '../locales/en.json';

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'>;

export function renderWithIntl(ui: ReactElement, options?: CustomRenderOptions) {
  const result = render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      {ui}
    </NextIntlClientProvider>,
    options
  );

  return {
    ...result,
    rerender: (rerenderUi: ReactElement) =>
      result.rerender(
        <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
          {rerenderUi}
        </NextIntlClientProvider>
      ),
  };
}
