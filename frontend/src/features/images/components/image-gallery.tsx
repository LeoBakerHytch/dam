import { useQuery } from '@apollo/client/react';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

import {
  type ImageAsset,
  ImageGalleryQuery,
  type ImageGalleryQueryResult,
  type ImageGalleryQueryVariables,
  readImageAssetFragment,
} from '@/graphql/images';
import { readPaginatorInfoFragment } from '@/graphql/pagination';

import { ImageAssetDetailSheet } from './image-asset-detail-sheet';
import { ImageAssetTile } from './image-asset-tile';
import { ImageAssetTileSkeleton } from './image-asset-tile-skeleton';
import { ImageGalleryPagination } from './image-gallery-pagination';

export function ImageGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [selectedAsset, setSelectedAsset] = useState<ImageAsset | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const { loading, error, data } = useQuery<ImageGalleryQueryResult, ImageGalleryQueryVariables>(
    ImageGalleryQuery,
    {
      variables: {
        page: currentPage,
      },
    },
  );

  const handlePageChange = useCallback((page: number) => {
    setSearchParams(page === 1 ? {} : { page: page.toString() });
  }, [setSearchParams]);

  const handleAssetClick = useCallback((asset: ImageAsset) => {
    setSelectedAsset(asset);
    setIsDetailSheetOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="grid h-full grid-rows-[1fr_auto] gap-6 p-5">
        <div className="min-h-0 overflow-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ImageAssetTileSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-red-600 dark:text-red-400">Error loading images: {error.message}</div>
      </div>
    );
  }

  const assets = data?.imageAssets?.data || [];
  const paginatorInfo = data?.imageAssets?.paginatorInfo;

  if (assets.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-neutral-600 dark:text-neutral-400">No images found</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid h-full grid-rows-[1fr_auto] gap-6 p-5">
        <div className="min-h-0 overflow-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-6">
            {assets.map(readImageAssetFragment).map((asset) => (
              <ImageAssetTile
                key={asset.id}
                asset={asset}
                onClick={() => handleAssetClick(asset)}
              />
            ))}
          </div>
        </div>

        {paginatorInfo && (
          <ImageGalleryPagination
            paginatorInfo={readPaginatorInfoFragment(paginatorInfo)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <ImageAssetDetailSheet
        asset={selectedAsset}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
      />
    </>
  );
}
