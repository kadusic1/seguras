export function PageShell({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
    </div>
  );
}
