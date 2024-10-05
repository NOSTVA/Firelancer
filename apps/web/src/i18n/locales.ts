import localeConfig from "./config.json" with { type: "json" };

export interface LocaleConfig {
  code: string;
  localName: string;
  name: string;
  langDir: string;
  dateFormat: string;
  hrefLang: string;
  enabled: boolean;
}

const availableLocales = localeConfig.filter((locale) => locale.enabled);

const availableLocaleCodes = availableLocales.map((locale) => locale.code);

const defaultLocale: LocaleConfig | undefined = availableLocales.find(
  (locale) => locale.default
);

const availableLocalesMap = Object.fromEntries(
  localeConfig.map((locale) => [locale.code, locale])
);

export {
  availableLocales,
  availableLocaleCodes,
  availableLocalesMap,
  defaultLocale
};
