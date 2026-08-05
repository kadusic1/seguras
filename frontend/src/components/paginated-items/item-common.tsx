import type { ReactNode } from "react";
import { type ColorScheme, type SchemeTokens, schemes } from "@/lib/colours";

interface ItemCommonProps {
  bgScheme?: ColorScheme;
  children: (surface: ColorScheme, s: SchemeTokens) => ReactNode;
}

export function ItemCommon({ bgScheme = "white", children }: ItemCommonProps) {
  const surface: ColorScheme =
    bgScheme === "black" ? "white" : bgScheme === "white" ? "black" : "red";
  const s = schemes[surface];
  const cardSurface =
    surface === "red"
      ? schemes.red.card
      : surface === "white"
        ? "border-black/10 bg-white"
        : "border-white/10 bg-black";

  return (
    <article
      className={`mx-auto w-full max-w-3xl rounded-lg border p-6 sm:p-8 ${cardSurface}`}
    >
      {children(surface, s)}
    </article>
  );
}
