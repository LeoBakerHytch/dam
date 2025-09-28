import { ScanEyeIcon, TextAlignStartIcon } from 'lucide-react';
import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { type ImageAsset } from '@/graphql/images';

export function ImageAssetTile({ asset, onClick }: { asset: ImageAsset; onClick?: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="flex w-40 cursor-pointer flex-col gap-2 transition-opacity hover:opacity-75"
      onClick={onClick}
    >
      <div className="relative h-32 w-full">
        {!imageLoaded && (
          <div className="flex h-32 w-full items-center justify-center rounded-sm bg-neutral-100 dark:bg-neutral-800" />
        )}
        <img
          className={cn(
            'h-32 w-full rounded-sm object-cover transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          src={asset.thumbnailUrl}
          alt={asset.altText || asset.name}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Tags in top-left */}
        {asset.tags && asset.tags.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {asset.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
                {tag}
              </span>
            ))}
            {asset.tags.length > 2 && (
              <span className="rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
                +{asset.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Description and Alt Text icons in bottom-left */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {asset.description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded bg-black/50 p-1.5">
                  <TextAlignStartIcon className="h-3 w-3 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="line-clamp-2">{asset.description}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {asset.altText && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded bg-black/50 p-1.5">
                  <ScanEyeIcon className="h-3 w-3 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="line-clamp-2">{asset.altText}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-ellipsis text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {asset.name}
        </p>

        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>{asset.fileSizeHuman}</span>
          {asset.width && asset.height && (
            <span>
              {asset.width} × {asset.height}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
