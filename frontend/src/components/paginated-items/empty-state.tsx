import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No items found yet",
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-2xl border-2 border-gray-400 bg-gray-200 p-6 text-center sm:p-8">
      <PackageOpen className="size-12 text-gray-500" strokeWidth={1.5} />
      <p className="text-base text-gray-600">{message}</p>
    </div>
  );
}
