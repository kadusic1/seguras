export const locales = ["nl", "en"] as const;
export type Locale = (typeof locales)[number];

// Explicit product requirement: Dutch is the default, regardless of browser
// Accept-Language. Do not add Accept-Language negotiation here.
export const defaultLocale: Locale = "nl";

export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
