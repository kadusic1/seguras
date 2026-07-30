import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariantStyles, type ColorScheme, schemes } from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Text } from "./text";

type CardShared = {
  variant?: "icon" | "listing";
  icon?: LucideIcon;
  heroIcon?: LucideIcon;
  title: string;
  description?: string;
  buttonLabel?: string;
  badge?: string;
  meta?: { label: string; value: string }[];
  bgScheme?: ColorScheme;
  clickable?: boolean;
  ctaVariant?: "link" | "primary";
  ctaCentered?: boolean;
};

type CardWithHref = CardShared & { href: string; onClick?: undefined };
type CardWithOnClick = CardShared & { href?: undefined; onClick: () => void };
type CardStatic = CardShared & { href?: undefined; onClick?: undefined };

type CardProps = CardWithHref | CardWithOnClick | CardStatic;

const listingBorder: Record<ColorScheme, string> = {
  red: "border-l-white",
  black: "border-l-red-500",
  white: "border-l-red-500",
};

export function Card({
  variant = "icon",
  icon: Icon,
  heroIcon: HeroIcon,
  title,
  description,
  href,
  onClick,
  buttonLabel,
  badge,
  meta,
  bgScheme = "red",
  clickable = true,
  ctaVariant = "link",
  ctaCentered = false,
}: CardProps) {
  const isListing = variant === "listing";
  const s = schemes[bgScheme];

  const cardClasses = `group rounded-lg border p-6 sm:p-8 transition-all duration-300 ${s.card}${isListing ? ` ${listingBorder[bgScheme]} hover:border-l-[6px]` : " hover:-translate-y-1"}${clickable ? " cursor-pointer" : ""}${ctaCentered ? " text-center" : ""}`;

  const content = (
    <>
      {HeroIcon && (
        <div className={ctaCentered ? "flex justify-center" : ""}>
          <HeroIcon
            className={`mb-4 h-12 w-12 transition-colors ${s.accent}`}
            strokeWidth={1.5}
          />
        </div>
      )}
      <Heading
        as="h3"
        size="md"
        bgScheme={bgScheme}
        icon={Icon}
        badge={isListing ? badge : undefined}
      >
        {isListing && href && !clickable ? (
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        ) : (
          title
        )}
      </Heading>
      {description && (
        <Text variant="base" bgScheme={bgScheme} className="mt-2">
          {description}
        </Text>
      )}
      {isListing && meta && meta.length > 0 && (
        <div
          className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm ${s.text.muted}${ctaCentered ? " justify-center" : ""}`}
        >
          {meta.map((m) => (
            <span key={m.label}>
              <span className="font-semibold">{m.label}:</span> {m.value}
            </span>
          ))}
        </div>
      )}
      {(href || onClick) && !clickable && (
        <Button
          variant="link"
          bgScheme={bgScheme}
          {...(href ? { href } : { onClick })}
          iconRight={<ArrowRight />}
          className="mt-4"
        >
          {buttonLabel ?? "Learn more"}
        </Button>
      )}
      {(href || onClick) &&
        clickable &&
        (ctaVariant === "primary" ? (
          <span
            className={`mt-4 inline-flex items-center gap-1 rounded-md px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors sm:px-6 sm:py-3 sm:text-sm ${buttonVariantStyles.primary[s.buttonScheme]}`}
          >
            {buttonLabel ?? "Learn more"}
            <ArrowRight className="h-4 w-4" />
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${buttonVariantStyles.link[bgScheme]} mt-4`}
          >
            {buttonLabel ?? "Learn more"}
            <ArrowRight className="h-4 w-4" />
          </span>
        ))}
    </>
  );

  if (clickable && href) {
    return (
      <Link href={href} className={`${cardClasses} block`}>
        {content}
      </Link>
    );
  }

  if (clickable && onClick) {
    return (
      <button
        type="button"
        className={`${cardClasses}${ctaCentered ? "" : " text-start"}`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}
