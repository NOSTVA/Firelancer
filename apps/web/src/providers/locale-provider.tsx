import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTimeZone } from "next-intl/server";
import { FC, PropsWithChildren } from "react";

export const LocaleProvider: FC<PropsWithChildren> = async ({ children }) => {
  const messages = await getMessages();
  const timezone = await getTimeZone();
  return (
    <NextIntlClientProvider messages={messages} timeZone={timezone}>
      {children}
    </NextIntlClientProvider>
  );
};
