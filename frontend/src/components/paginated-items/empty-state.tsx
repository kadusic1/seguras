import { PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { itemCardClassName } from "./item-common";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  const t = useTranslations("Common");

  return (
    <div
      className={`${itemCardClassName} flex flex-col items-center gap-4 text-center`}
    >
      <PackageOpen className="size-12 text-black/30" strokeWidth={1.5} />
      <p className="text-base text-black/60">
        {message ?? t("empty.noItemsFound")}
      </p>
    </div>
  );
}
