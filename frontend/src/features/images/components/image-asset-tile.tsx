import { ImageAsset } from '@/types/graphql';

interface ImageAssetTileProps {
  asset: ImageAsset;
  onClick?: () => void;
}

export function ImageAssetTile({ asset, onClick }: ImageAssetTileProps) {
  return (
    <div
      className="flex w-40 flex-col gap-2 cursor-pointer hover:opacity-75 transition-opacity"
      onClick={onClick}
    >
      <div className="relative">
        <img
          className="h-32 w-full rounded-sm object-cover"
          src={asset.url}
          alt={asset.altText || asset.name}
        />
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

        {asset.description && (
          <p className="line-clamp-2 text-xs text-neutral-600 dark:text-neutral-300">
            {asset.description}
          </p>
        )}
      </div>
    </div>
  );
}
