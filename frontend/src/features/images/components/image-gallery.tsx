import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { gql, useQuery } from 'urql';

import { IMAGE_ASSET_FRAGMENT } from '@/lib/graphql-fragments';
import { type ImageAsset } from '@/types/graphql';

import { ImageAssetDetailSheet } from './image-asset-detail-sheet';
import { ImageAssetTile } from './image-asset-tile';
import { ImageAssetTileSkeleton } from './image-asset-tile-skeleton';
import { ImageGalleryPagination } from './image-gallery-pagination';

interface PaginatorInfo {
  currentPage: number;
  lastPage: number;
  hasMorePages: boolean;
  perPage: number;
  total: number;
}

interface ImageAssetsQuery {
  imageAssets: {
    data: ImageAsset[];
    paginatorInfo: PaginatorInfo;
  };
}

const imageAssetsQuery = gql`
  query ImageAssets($page: Int) {
    imageAssets(page: $page) {
      data {
        ...ImageAssetFragment
      }
      paginatorInfo {
        currentPage
        lastPage
        hasMorePages
        perPage
        total
      }
    }
  }
  ${IMAGE_ASSET_FRAGMENT}
`;

export function ImageGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [selectedAsset, setSelectedAsset] = useState<ImageAsset | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const [{ data, fetching, error }] = useQuery<ImageAssetsQuery>({
    query: imageAssetsQuery,
    variables: { page: currentPage },
  });

  const handlePageChange = (page: number) => {
    setSearchParams(page === 1 ? {} : { page: page.toString() });
  };

  const handleAssetClick = (asset: ImageAsset) => {
    setSelectedAsset(asset);
    setIsDetailSheetOpen(true);
  };

  if (fetching) {
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
            {assets.map((asset) => (
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
            paginatorInfo={paginatorInfo}
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
