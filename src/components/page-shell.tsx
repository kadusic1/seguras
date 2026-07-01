import type { ReactNode } from "react";

export function PageShell({
  children,
  title,
}: {
  children?: ReactNode;
  title?: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      {title ? (
        <h1 className="text-4xl font-bold text-white">{title}</h1>
      ) : null}
      {children}
    </div>
  );
}
