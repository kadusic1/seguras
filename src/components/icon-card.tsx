import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ColorScheme } from "@/lib/colours";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  colorScheme?: ColorScheme;
}

const cardColourMap: Record<ColorScheme, string> = {
  red: "border-black/10 bg-black/5",
  black: "border-white/10 bg-white/5",
  white: "border-black/10 bg-black/5",
};

const iconColourMap: Record<ColorScheme, string> = {
  red: "text-red-500",
  black: "text-red-500",
  white: "text-black",
};

const titleColourMap: Record<ColorScheme, string> = {
  red: "text-black",
  black: "text-white",
  white: "text-black",
};

const descColourMap: Record<ColorScheme, string> = {
  red: "text-black/60",
  black: "text-white/70",
  white: "text-black/60",
};

const linkColourMap: Record<ColorScheme, string> = {
  red: "text-red-500 hover:text-red-400",
  black: "text-red-500 hover:text-red-400",
  white: "text-black/70 hover:text-black",
};

export function IconCard({
  icon: Icon,
  title,
  description,
  href,
  colorScheme = "red",
}: IconCardProps) {
  return (
    <div
      className={`group rounded-lg border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${cardColourMap[colorScheme]}`}
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
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform group-hover:translate-x-0.5"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
