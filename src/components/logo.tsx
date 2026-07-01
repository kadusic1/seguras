import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
        <Image
          src="/logo.svg"
          alt="Seguras"
          width={26}
          height={26}
          className="h-auto w-auto"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-black italic leading-none tracking-tight text-white">
          SEGURAS
        </span>
        <span className="-mt-0.5 text-sm font-medium leading-none text-white/80">
          SECURITY
        </span>
        <div className="mt-1 h-1 w-full bg-red-600" />
      </div>
    </Link>
  );
}
