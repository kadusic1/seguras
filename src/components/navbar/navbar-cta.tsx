import Link from "next/link";

export function NavbarCta() {
  return (
    <Link
      href="/contact"
      className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold italic text-white transition-colors hover:bg-red-700"
    >
      Contact
    </Link>
  );
}
