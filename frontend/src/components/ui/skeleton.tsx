interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`relative animate-pulse overflow-hidden rounded-md bg-black/15 bg-[repeating-linear-gradient(115deg,transparent_0_18px,rgba(0,0,0,0.08)_18px_36px)] ${className}`}
    >
      <div className="absolute inset-y-0 left-0 w-full -skew-x-12 animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}
