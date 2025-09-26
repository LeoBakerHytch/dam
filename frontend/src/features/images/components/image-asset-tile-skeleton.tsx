import { Skeleton } from '@/components/ui/skeleton';

export function ImageAssetTileSkeleton() {
  return (
    <div className="flex w-40 cursor-pointer flex-col gap-2">
      <div className="relative">
        <Skeleton className="h-32 w-full rounded-sm" />
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-3/4" />

        <div className="flex items-center justify-between text-xs">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
