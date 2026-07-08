import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  type ColorScheme,
  cardBorderBgColourMap,
  iconColourMap,
  listingAccentColourMap,
  listingMetaColourMap,
} from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Text } from "./text";

interface CardProps {
  variant?: "icon" | "listing";
  icon?: LucideIcon;
  heroIcon?: LucideIcon;
  title: string;
  description?: string;
  href?: string;
  badge?: string;
  meta?: { label: string; value: string }[];
  colorScheme?: ColorScheme;
}

export function Card({
  variant = "icon",
  icon: Icon,
  heroIcon: HeroIcon,
  title,
  description,
  href,
  badge,
  meta,
  colorScheme = "red",
}: CardProps) {
  const isListing = variant === "listing";

  return (
    <div
      className={`group rounded-lg border p-6 sm:p-8 transition-all duration-300 ${cardBorderBgColourMap[colorScheme]}${isListing ? ` ${listingAccentColourMap[colorScheme]} hover:border-l-[6px]` : " hover:-translate-y-1"}`}
    >
      {HeroIcon && (
        <HeroIcon
          className={`mb-4 h-12 w-12 transition-colors ${iconColourMap[colorScheme]}`}
          strokeWidth={1.5}
        />
      )}
      <Heading
        as="h3"
        size="card"
        color={colorScheme}
        icon={Icon}
        badge={isListing ? badge : undefined}
      >
        {isListing && href ? (
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        ) : (
          title
        )}
      </Heading>
      {description && (
        <Text variant="body" color={colorScheme} className="mt-2">
          {description}
        </Text>
      )}
      {isListing && meta && meta.length > 0 && (
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
        <Button
          variant="link"
          colorScheme={colorScheme}
          href={href}
          iconRight={<ArrowRight />}
          className="mt-4"
        >
          Learn more
        </Button>
      )}
    </div>
  );
}
