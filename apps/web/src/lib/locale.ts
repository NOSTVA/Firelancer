"use server";

import { cookies } from "next/headers";
import { availableLocalesMap, defaultLocale } from "@/i18n/locales";
import { getLocale } from "next-intl/server";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || defaultLocale?.code;
}

export async function setUserLocale(locale: string) {
  cookies().set(COOKIE_NAME, locale);
}

export async function getLocaleLangDirection(locale?: string) {
  if (!locale) {
    locale = await getLocale();
  }

  return availableLocalesMap[locale] ? "rtl" : "ltr";
}
