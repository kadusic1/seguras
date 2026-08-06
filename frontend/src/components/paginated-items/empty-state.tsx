import { PackageOpen } from "lucide-react";
import { itemCardClassName } from "./item-common";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No items found yet",
}: EmptyStateProps) {
  return (
    <div
      className={`${itemCardClassName} flex flex-col items-center gap-4 text-center`}
    >
      <PackageOpen className="size-12 text-gray-500" strokeWidth={1.5} />
      <p className="text-base text-gray-600">{message}</p>
    </div>
  );
}
