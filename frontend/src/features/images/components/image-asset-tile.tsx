import { ScanEyeIcon, TextAlignStartIcon } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ImageAsset } from '@/types/graphql';

interface ImageAssetTileProps {
  asset: ImageAsset;
  onClick?: () => void;
}

export function ImageAssetTile({ asset, onClick }: ImageAssetTileProps) {
  return (
    <div
      className="flex w-40 cursor-pointer flex-col gap-2 transition-opacity hover:opacity-75"
      onClick={onClick}
    >
      <div className="relative">
        <img
          className="h-32 w-full rounded-sm object-cover"
          src={asset.url}
          alt={asset.altText || asset.name}
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
