export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="pointer-events-none absolute -inset-40 bg-[radial-gradient(ellipse_at_bottom,#3a0000,transparent_70%)]" />
      {children}
    </div>
  );
}
