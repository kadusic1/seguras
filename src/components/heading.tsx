import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  badgeColourMap,
  type ColorScheme,
  iconColourMap,
  textColourMap,
  titleColourMap,
} from "@/lib/colours";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = "hero" | "card" | "small";

interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingSize;
  children: ReactNode;
  className?: string;
  color?: ColorScheme;
  icon?: LucideIcon;
  badge?: string;
  iconPosition?: "left" | "right";
  badgePosition?: "left" | "right";
}

const sizeStyles: Record<HeadingSize, string> = {
  hero: "font-black italic leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  card: "text-xl font-bold sm:text-2xl",
  small: "text-lg font-semibold",
};

const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  h1: "hero",
  h2: "hero",
  h3: "card",
  h4: "small",
  h5: "small",
  h6: "small",
};

const colourMapForSize: Record<HeadingSize, Record<ColorScheme, string>> = {
  hero: textColourMap,
  card: titleColourMap,
  small: textColourMap,
};

export function Heading({
  as: Tag = "h2",
  size,
  className,
  children,
  color = "white",
  icon: Icon,
  badge,
  iconPosition = "left",
  badgePosition = "right",
}: HeadingProps) {
  const resolvedSize = size ?? defaultSizeForLevel[Tag];
  const tagClass = `${sizeStyles[resolvedSize]} ${colourMapForSize[resolvedSize][color]}${className ? ` ${className}` : ""}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon
          className={`h-6 w-6 shrink-0 ${iconColourMap[color]}`}
          strokeWidth={1.5}
        />
      )}
      {badge && badgePosition === "left" && (
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColourMap[color]}`}
        >
          {badge}
        </span>
      )}
      <Tag className={tagClass}>{children}</Tag>
      {badge && badgePosition === "right" && (
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColourMap[color]}`}
        >
          {badge}
        </span>
      )}
      {Icon && iconPosition === "right" && (
        <Icon
          className={`h-6 w-6 shrink-0 ${iconColourMap[color]}`}
          strokeWidth={1.5}
        />
      )}
    </>
  );

  if (Icon || badge) {
    return <div className="flex items-center gap-2">{content}</div>;
  }

  return <>{content}</>;
}
