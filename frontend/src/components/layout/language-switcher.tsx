"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { type Locale, locales } from "@/i18n/locale";
import { setUserLocale } from "@/i18n/locale-actions";

const localeLabel: Record<Locale, string> = {
  nl: "NL",
  en: "EN",
};

// Full names for screen readers / tooltips only — the visible label stays
// as the language's own short code (see spec rationale: never translate
// a language's own name).
const localeFullName: Record<Locale, string> = {
  nl: "Nederlands",
  en: "English",
};

export function LanguageSwitcher() {
  const activeLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: Locale) {
    if (next === activeLocale || isPending) return;
    startTransition(() => {
      setUserLocale(next);
    });
  }

  return (
    <fieldset
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-md border border-zinc-800 bg-zinc-950 p-0.5"
    >
      {locales.map((l) => {
        const isActive = l === activeLocale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => handleSelect(l)}
            disabled={isPending}
            aria-pressed={isActive}
            title={localeFullName[l]}
            className={`cursor-pointer rounded px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isActive
                ? "bg-red-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {localeLabel[l]}
          </button>
        );
      })}
    </fieldset>
  );
}
