import { UploadIcon } from 'lucide-react';

export function ImageUploadTile({ onClick }: { onClick?: () => void }) {
  return (
    <div className="flex w-40 cursor-pointer flex-col gap-2" onClick={onClick}>
      <div className="relative">
        <div className="flex h-32 w-full items-center justify-center rounded-sm border-2 border-dashed border-neutral-300 bg-neutral-50 transition-opacity hover:opacity-75 dark:border-neutral-600 dark:bg-neutral-800">
          <div className="flex flex-col items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <UploadIcon className="h-6 w-6" />
            <span className="select-none text-center text-xs leading-tight">
              Click here
              <br />
              or drop files
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-ellipsis text-sm font-medium text-neutral-600 dark:text-neutral-300">
          Accepted file types
        </p>
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          JPG, PNG, GIF, WebP
        </div>
      </div>
    </div>
  );
}
