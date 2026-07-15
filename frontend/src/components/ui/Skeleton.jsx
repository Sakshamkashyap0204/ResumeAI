function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-surface-3)] rounded-[var(--radius-sm)] ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  );
}

export default Skeleton;
