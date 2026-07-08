import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { type ColorScheme, schemes } from "@/lib/colours";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = "xl" | "lg" | "md" | "sm";

interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingSize;
  children: ReactNode;
  className?: string;
  bgScheme?: ColorScheme;
  emphasis?: "primary" | "muted";
  icon?: LucideIcon;
  badge?: string;
  iconPosition?: "left" | "right";
  badgePosition?: "left" | "right";
}

const sizeStyles: Record<HeadingSize, string> = {
  xl: "font-black italic leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  lg: "text-2xl font-bold",
  md: "text-xl font-bold sm:text-2xl",
  sm: "text-lg font-semibold",
};

const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  h1: "xl",
  h2: "xl",
  h3: "md",
  h4: "sm",
  h5: "sm",
  h6: "sm",
};

const badgeStyles: Record<ColorScheme, string> = {
  red: "bg-red-700 text-white",
  black: "bg-red-500/10 text-red-400",
  white: "bg-red-500/10 text-red-600",
};

export function Heading({
  as: Tag = "h2",
  size,
  className,
  children,
  bgScheme = "white",
  emphasis = "primary",
  icon: Icon,
  badge,
  iconPosition = "left",
  badgePosition = "right",
}: HeadingProps) {
  const resolvedSize = size ?? defaultSizeForLevel[Tag];
  const s = schemes[bgScheme];
  const textColor = emphasis === "primary" ? s.text.primary : s.text.muted;
  const tagClass = `${sizeStyles[resolvedSize]} ${textColor}${className ? ` ${className}` : ""}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon className={`h-6 w-6 shrink-0 ${s.accent}`} strokeWidth={1.5} />
      )}
      {badge && badgePosition === "left" && (
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[bgScheme]}`}
        >
          {badge}
        </span>
      )}
      <Tag className={tagClass}>{children}</Tag>
      {badge && badgePosition === "right" && (
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[bgScheme]}`}
        >
          {badge}
        </span>
      )}
      {Icon && iconPosition === "right" && (
        <Icon className={`h-6 w-6 shrink-0 ${s.accent}`} strokeWidth={1.5} />
      )}
    </>
  );

  if (Icon || badge) {
    return <div className="flex items-center gap-2">{content}</div>;
  }

  return <>{content}</>;
}
