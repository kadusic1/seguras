"use client";

import { useTranslations } from "next-intl";

interface RelativeTimeProps {
  date: string;
}

const MINUTE_MS = 60 * 1000;
const HOUR_MIN = 60;
const DAY_MIN = 24 * 60;
const MONTH_MIN = 30 * 24 * 60;
const YEAR_MIN = 12 * 30 * 24 * 60;

/**
 * Right-aligned relative timestamp for card headers, rounded down to the
 * largest unit ("5m ago", "2u geleden"). Renders the full date in a
 * tooltip. Timestamps under a minute and in the future clamp to 1 minute.
 */
export function RelativeTime({ date }: RelativeTimeProps) {
  const t = useTranslations("Common");
  const minutes = Math.max(
    1,
    Math.floor((Date.now() - new Date(date).getTime()) / MINUTE_MS),
  );

  let key: string;
  let value: number;
  if (minutes < HOUR_MIN) {
    key = "time.minute";
    value = minutes;
  } else if (minutes < DAY_MIN) {
    key = "time.hour";
    value = Math.floor(minutes / HOUR_MIN);
  } else if (minutes < MONTH_MIN) {
    key = "time.day";
    value = Math.floor(minutes / DAY_MIN);
  } else if (minutes < YEAR_MIN) {
    key = "time.month";
    value = Math.floor(minutes / MONTH_MIN);
  } else {
    key = "time.year";
    value = Math.floor(minutes / YEAR_MIN);
  }

  return (
    <time
      className="ml-auto shrink-0 text-sm text-black/60"
      dateTime={date}
      title={new Date(date).toLocaleString()}
    >
      {t(key, { value })}
    </time>
  );
}
