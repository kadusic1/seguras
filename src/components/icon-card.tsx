import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  type ColorScheme,
  cardBorderBgColourMap,
  descColourMap,
  iconColourMap,
  linkColourMap,
  titleColourMap,
} from "@/lib/colours";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  colorScheme?: ColorScheme;
}

export function IconCard({
  icon: Icon,
  title,
  description,
  href,
  colorScheme = "red",
}: IconCardProps) {
  return (
    <div
      className={`group rounded-lg border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${cardBorderBgColourMap[colorScheme]}`}
    >
      <Icon
        className={`mb-4 h-12 w-12 transition-colors ${iconColourMap[colorScheme]}`}
        strokeWidth={1.5}
      />
      <h3
        className={`text-xl font-bold sm:text-2xl ${titleColourMap[colorScheme]}`}
      >
        {title}
      </h3>
      <p className={`mt-2 leading-relaxed ${descColourMap[colorScheme]}`}>
        {description}
      </p>
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
