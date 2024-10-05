import { defineRouting } from "next-intl/routing";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { availableLocaleCodes, defaultLocale } from "@/i18n/locales";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: availableLocaleCodes,

  // Used when no locale matches
  defaultLocale: defaultLocale?.code || "ar",

  localePrefix: "as-needed"
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { redirect, usePathname, useRouter, Link } =
  createSharedPathnamesNavigation(routing);
