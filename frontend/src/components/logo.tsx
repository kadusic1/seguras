import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  onClick?: () => void;
  variant?: "light" | "dark";
};

const textStyles = {
  light: { primary: "text-white", muted: "text-white/90" },
  dark: { primary: "text-black", muted: "text-black/60" },
} as const;

function logoContent(variant: "light" | "dark") {
  const t = textStyles[variant];
  return (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
        <Image
          src="/logo.svg"
          alt="Seguras"
          width={26}
          height={26}
          priority
          style={{ width: "auto", height: "auto" }}
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`text-2xl font-black italic leading-none tracking-tight ${t.primary}`}
        >
          SEGURAS
        </span>
        <span className={`-mt-0.5 text-sm font-bold leading-none ${t.muted}`}>
          SECURITY
        </span>
        <div className="mt-1 h-1 w-full bg-red-600" />
      </div>
    </>
  );
}

export function Logo({ href = "/", onClick, variant = "light" }: LogoProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex cursor-pointer items-center gap-3 text-left"
      >
        {logoContent(variant)}
      </button>
    );
  }

  return (
    <Link href={href} className="flex items-center gap-3">
      {logoContent(variant)}
    </Link>
  );
}
