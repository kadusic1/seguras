import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  type ColorScheme,
  cardBorderBgColourMap,
  descColourMap,
  linkColourMap,
  listingAccentColourMap,
  listingBadgeColourMap,
  listingMetaColourMap,
  titleColourMap,
} from "@/lib/colours";

interface ListingCardProps {
  title: string;
  description?: string;
  href?: string;
  badge?: string;
  meta?: { label: string; value: string }[];
  colorScheme?: ColorScheme;
}

export function ListingCard({
  title,
  description,
  href,
  badge,
  meta,
  colorScheme = "red",
}: ListingCardProps) {
  return (
    <div
      className={`group rounded-lg border p-6 sm:p-8 transition-all duration-300 ${cardBorderBgColourMap[colorScheme]} ${listingAccentColourMap[colorScheme]} hover:border-l-[6px]`}
    >
      {badge && (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${listingBadgeColourMap[colorScheme]}`}
        >
          {badge}
        </span>
      )}
      <h3
        className={`text-xl font-bold sm:text-2xl ${badge ? "mt-2" : ""} ${titleColourMap[colorScheme]}`}
      >
        {href ? (
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      {description && (
        <p className={`mt-2 leading-relaxed ${descColourMap[colorScheme]}`}>
          {description}
        </p>
      )}
      {meta && meta.length > 0 && (
        <div
          className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm ${listingMetaColourMap[colorScheme]}`}
        >
          {meta.map((m) => (
            <span key={m.label}>
              <span className="font-semibold">{m.label}:</span> {m.value}
            </span>
          ))}
        </div>
      )}
      {href && (
        <Link
          href={href}
          className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors ${linkColourMap[colorScheme]}`}
        >
          Learn more
          <ArrowRight />
        </Link>
      )}
    </div>
  );
}
