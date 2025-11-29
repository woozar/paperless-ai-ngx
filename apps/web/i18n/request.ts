import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value as Locale | undefined;

  // Then try Accept-Language header
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const browserLocale = acceptLanguage?.split(',')[0]?.split('-')[0] as Locale | undefined;

  // Determine the locale to use
  let locale: Locale = defaultLocale;

  if (localeCookie && locales.includes(localeCookie)) {
    locale = localeCookie;
  } else if (browserLocale && locales.includes(browserLocale)) {
    locale = browserLocale;
  }

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
