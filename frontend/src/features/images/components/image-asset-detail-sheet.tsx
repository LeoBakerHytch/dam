import { CalendarIcon, FileIcon, ImageIcon, TagIcon } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatDate } from '@/lib/utils';
import { ImageAsset } from '@/types/graphql';

export function ImageAssetDetailSheet({
  asset,
  open,
  onOpenChange,
}: {
  asset: ImageAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!asset) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-left">{asset.name}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          <div className="relative">
            <img
              src={asset.url}
              alt={asset.altText || asset.name}
              className="max-h-64 w-full rounded-lg object-contain"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <FileIcon className="h-4 w-4 text-neutral-500" />
              <span className="font-medium">File:</span>
              <span className="text-neutral-600 dark:text-neutral-400">{asset.fileName}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Size:</span>
              <span className="text-neutral-600 dark:text-neutral-400">{asset.fileSizeHuman}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4 text-neutral-500" />
              <span className="font-medium">Dimensions:</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {asset.width} × {asset.height}px
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Type:</span>
              <span className="text-neutral-600 dark:text-neutral-400">{asset.mimeType}</span>
            </div>
          </div>

          {asset.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{asset.description}</p>
            </div>
          )}

          {asset.altText && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Alt Text</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{asset.altText}</p>
            </div>
          )}

          {asset.tags && asset.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-neutral-500" />
                <h4 className="text-sm font-medium">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {asset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-neutral-500" />
              <span className="font-medium">Created:</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {formatDate(asset.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-neutral-500" />
              <span className="font-medium">Updated:</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {formatDate(asset.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
